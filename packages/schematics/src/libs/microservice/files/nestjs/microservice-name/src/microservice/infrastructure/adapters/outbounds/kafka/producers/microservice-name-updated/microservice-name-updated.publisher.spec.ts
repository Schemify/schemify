import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from '../../client/kafka-producer.service'
import { KafkaMicroserviceNameDescriptionUpdatedPublisher } from './microserviceName-updated.publisher'
import { MicroserviceNameDescriptionUpdatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-description-updated.event'
import { DescriptionValueObject } from '@microserviceName/microservice/domain/value-objects/description.value-object'

describe('KafkaMicroserviceNameDescriptionUpdatedPublisher', () => {
  let publisher: KafkaMicroserviceNameDescriptionUpdatedPublisher
  let emitSpy: jest.Mock

  beforeEach(async () => {
    const mockKafkaProducerService = {
      emit: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaMicroserviceNameDescriptionUpdatedPublisher,
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService
        }
      ]
    }).compile()

    publisher =
      module.get<KafkaMicroserviceNameDescriptionUpdatedPublisher>(
        KafkaMicroserviceNameDescriptionUpdatedPublisher
      )
    emitSpy = mockKafkaProducerService.emit
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publish', () => {
    it('should publish microserviceName description updated event successfully', async () => {
      // Arrange
      const event = new MicroserviceNameDescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith(
        'microserviceName.description-updated',
        {
          key: 'test-id',
          value: JSON.stringify({
            type: 'MicroserviceNameDescriptionUpdated',
            version: 1,
            payload: event
          })
        }
      )
    })

    it('should format message with correct envelope structure', async () => {
      // Arrange
      const event = new MicroserviceNameDescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue).toMatchObject({
        type: 'MicroserviceNameDescriptionUpdated',
        version: 1,
        payload: {
          id: 'test-id',
          newDescription: { value: 'Nueva descripción' }
        }
      })
    })

    it('should use event id as message key', async () => {
      // Arrange
      const event = new MicroserviceNameDescriptionUpdatedEvent(
        'unique-id',
        DescriptionValueObject.create('Otra descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'microserviceName.description-updated',
        expect.objectContaining({
          key: 'unique-id'
        })
      )
    })

    it('should publish to correct kafka topic', async () => {
      // Arrange
      const event = new MicroserviceNameDescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        'microserviceName.description-updated',
        expect.any(Object)
      )
    })

    it('should handle kafka producer errors', async () => {
      // Arrange
      const event = new MicroserviceNameDescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )
      const kafkaError = new Error('Kafka connection failed')
      emitSpy.mockRejectedValueOnce(kafkaError)

      // Act & Assert
      await expect(publisher.publish(event)).rejects.toThrow(
        'Kafka connection failed'
      )
      expect(emitSpy).toHaveBeenCalledTimes(1)
    })
  })
})
