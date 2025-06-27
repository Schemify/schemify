import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from '../../micromicro/kafka-producer.service'
import { KafkaMicromicroCreatedPublisher } from './micromicro-created.adapter'
import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('KafkaMicromicroCreatedPublisher', () => {
  let publisher: KafkaMicromicroCreatedPublisher
  let emitSpy: jest.Mock

  beforeEach(async () => {
    const mockKafkaProducerService = {
      emit: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaMicromicroCreatedPublisher,
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService
        }
      ]
    }).compile()

    publisher = module.get<KafkaMicromicroCreatedPublisher>(
      KafkaMicromicroCreatedPublisher
    )
    emitSpy = mockKafkaProducerService.emit
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publish', () => {
    it('should publish micromicro created event successfully', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith('micromicro.created', {
        key: micromicro.id,
        value: JSON.stringify({
          type: 'MicromicroCreated',
          version: 1,
          payload: event
        })
      })
    })

    it('should format message with correct envelope structure', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue).toMatchObject({
        type: 'MicromicroCreated',
        version: 1,
        payload: {
          micromicro: {
            id: micromicro.id,
            props: {
              name: { value: 'Test Micromicro' },
              description: { value: 'Test Description' },
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            }
          },
          occurredAt: expect.any(String)
        }
      })
    })

    it('should use micromicro id as message key', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'micromicro.created',
        expect.objectContaining({
          key: micromicro.id
        })
      )
    })

    it('should publish to correct kafka topic', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'micromicro.created',
        expect.any(Object)
      )
    })

    it('should handle kafka producer errors', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      const kafkaError = new Error('Kafka connection failed')
      emitSpy.mockRejectedValueOnce(kafkaError)

      // Act & Assert
      await expect(publisher.publish(event)).rejects.toThrow(
        'Kafka connection failed'
      )
      expect(emitSpy).toHaveBeenCalledTimes(1)
    })

    it('should serialize event payload correctly', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue.payload).toBeDefined()
      expect(messageValue.payload.micromicro).toBeDefined()
      expect(messageValue.payload.micromicro.id).toBe(
        micromicro.id
      )
      expect(messageValue.payload.micromicro.props.name.value).toBe(
        'Test Micromicro'
      )
      expect(
        messageValue.payload.micromicro.props.description?.value
      ).toBe('Test Description')
    })

    it('should maintain event version consistency', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue.version).toBe(1)
    })

    it('should handle micromicro without description', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro'
        // No description
      })
      const event = new MicromicroCreatedEvent(
        micromicro
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'micromicro.created',
        expect.objectContaining({
          key: micromicro.id,
          value: expect.stringContaining('Test Micromicro')
        })
      )
    })
  })
})
