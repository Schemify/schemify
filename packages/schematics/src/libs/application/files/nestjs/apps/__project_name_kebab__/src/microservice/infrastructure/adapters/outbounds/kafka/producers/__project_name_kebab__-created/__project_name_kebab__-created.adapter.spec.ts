import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from '../../client/kafka-producer.service'
import { Kafka__project_name_camel__CreatedPublisher } from './__project_name_kebab__-created.adapter'
import { __project_name_camel__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'
import { __project_name_camel__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Kafka__project_name_camel__CreatedPublisher', () => {
  let publisher: Kafka__project_name_camel__CreatedPublisher
  let emitSpy: jest.Mock

  beforeEach(async () => {
    const mockKafkaProducerService = {
      emit: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Kafka__project_name_camel__CreatedPublisher,
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService
        }
      ]
    }).compile()

    publisher = module.get<Kafka__project_name_camel__CreatedPublisher>(
      Kafka__project_name_camel__CreatedPublisher
    )
    emitSpy = mockKafkaProducerService.emit
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publish', () => {
    it('should publish __project_name_camel__ created event successfully', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith('__project_name_camel__.created', {
        key: __project_name_camel__.id,
        value: JSON.stringify({
          type: '__project_name_camel__Created',
          version: 1,
          payload: event
        })
      })
    })

    it('should format message with correct envelope structure', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue).toMatchObject({
        type: '__project_name_camel__Created',
        version: 1,
        payload: {
          __project_name_camel__: {
            id: __project_name_camel__.id,
            props: {
              name: { value: 'Test __project_name_camel__' },
              description: { value: 'Test Description' },
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            }
          },
          occurredAt: expect.any(String)
        }
      })
    })

    it('should use __project_name_camel__ id as message key', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        '__project_name_camel__.created',
        expect.objectContaining({
          key: __project_name_camel__.id
        })
      )
    })

    it('should publish to correct kafka topic', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        '__project_name_camel__.created',
        expect.any(Object)
      )
    })

    it('should handle kafka producer errors', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
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
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue.payload).toBeDefined()
      expect(messageValue.payload.__project_name_camel__).toBeDefined()
      expect(messageValue.payload.__project_name_camel__.id).toBe(
        __project_name_camel__.id
      )
      expect(messageValue.payload.__project_name_camel__.props.name.value).toBe(
        'Test __project_name_camel__'
      )
      expect(
        messageValue.payload.__project_name_camel__.props.description?.value
      ).toBe('Test Description')
    })

    it('should maintain event version consistency', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__',
        description: 'Test Description'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue.version).toBe(1)
    })

    it('should handle __project_name_camel__ without description', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_camel__Entity.create({
        name: 'Test __project_name_camel__'
        // No description
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        '__project_name_camel__.created',
        expect.objectContaining({
          key: __project_name_camel__.id,
          value: expect.stringContaining('Test __project_name_camel__')
        })
      )
    })
  })
})
