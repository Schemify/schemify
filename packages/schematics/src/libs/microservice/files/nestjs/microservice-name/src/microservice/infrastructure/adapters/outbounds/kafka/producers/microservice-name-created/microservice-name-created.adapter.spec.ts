import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from '../../client/kafka-producer.service'
import { KafkaMicroserviceNameCreatedPublisher } from './microserviceName-created.adapter'
import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('KafkaMicroserviceNameCreatedPublisher', () => {
  let publisher: KafkaMicroserviceNameCreatedPublisher
  let emitSpy: jest.Mock

  beforeEach(async () => {
    const mockKafkaProducerService = {
      emit: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaMicroserviceNameCreatedPublisher,
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService
        }
      ]
    }).compile()

    publisher = module.get<KafkaMicroserviceNameCreatedPublisher>(
      KafkaMicroserviceNameCreatedPublisher
    )
    emitSpy = mockKafkaProducerService.emit
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publish', () => {
    it('should publish microserviceName created event successfully', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith('microserviceName.created', {
        key: microserviceName.id,
        value: JSON.stringify({
          type: 'MicroserviceNameCreated',
          version: 1,
          payload: event
        })
      })
    })

    it('should format message with correct envelope structure', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue).toMatchObject({
        type: 'MicroserviceNameCreated',
        version: 1,
        payload: {
          microserviceName: {
            id: microserviceName.id,
            props: {
              name: { value: 'Test MicroserviceName' },
              description: { value: 'Test Description' },
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            }
          },
          occurredAt: expect.any(String)
        }
      })
    })

    it('should use microserviceName id as message key', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'microserviceName.created',
        expect.objectContaining({
          key: microserviceName.id
        })
      )
    })

    it('should publish to correct kafka topic', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'microserviceName.created',
        expect.any(Object)
      )
    })

    it('should handle kafka producer errors', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
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
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue.payload).toBeDefined()
      expect(messageValue.payload.microserviceName).toBeDefined()
      expect(messageValue.payload.microserviceName.id).toBe(
        microserviceName.id
      )
      expect(messageValue.payload.microserviceName.props.name.value).toBe(
        'Test MicroserviceName'
      )
      expect(
        messageValue.payload.microserviceName.props.description?.value
      ).toBe('Test Description')
    })

    it('should maintain event version consistency', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue.version).toBe(1)
    })

    it('should handle microserviceName without description', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName'
        // No description
      })
      const event = new MicroserviceNameCreatedEvent(
        microserviceName
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'microserviceName.created',
        expect.objectContaining({
          key: microserviceName.id,
          value: expect.stringContaining('Test MicroserviceName')
        })
      )
    })
  })
})
