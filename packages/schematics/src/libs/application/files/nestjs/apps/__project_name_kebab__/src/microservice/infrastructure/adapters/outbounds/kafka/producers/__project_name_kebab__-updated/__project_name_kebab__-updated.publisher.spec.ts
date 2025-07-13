import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from '../../client/kafka-producer.service'
import { Kafka__project_name_camel__DescriptionUpdatedPublisher } from './__project_name_kebab__-updated.publisher'
import { __project_name_camel__DescriptionUpdatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-description-updated.event'
import { DescriptionValueObject } from 'apps/__project_name_kebab__/src/microservice/domain/value-objects/description.value-object'

describe('Kafka__project_name_camel__DescriptionUpdatedPublisher', () => {
  let publisher: Kafka__project_name_camel__DescriptionUpdatedPublisher
  let emitSpy: jest.Mock

  beforeEach(async () => {
    const mockKafkaProducerService = {
      emit: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Kafka__project_name_camel__DescriptionUpdatedPublisher,
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService
        }
      ]
    }).compile()

    publisher =
      module.get<Kafka__project_name_camel__DescriptionUpdatedPublisher>(
        Kafka__project_name_camel__DescriptionUpdatedPublisher
      )
    emitSpy = mockKafkaProducerService.emit
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('publish', () => {
    it('should publish __project_name_camel__ description updated event successfully', async () => {
      // Arrange
      const event = new __project_name_camel__DescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(1)
      expect(emitSpy).toHaveBeenCalledWith(
        '__project_name_camel__.description-updated',
        {
          key: 'test-id',
          value: JSON.stringify({
            type: '__project_name_camel__DescriptionUpdated',
            version: 1,
            payload: event
          })
        }
      )
    })

    it('should format message with correct envelope structure', async () => {
      // Arrange
      const event = new __project_name_camel__DescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      const callArgs = emitSpy.mock.calls[0]
      const messageValue = JSON.parse(callArgs[1].value)

      expect(messageValue).toMatchObject({
        type: '__project_name_camel__DescriptionUpdated',
        version: 1,
        payload: {
          id: 'test-id',
          newDescription: { value: 'Nueva descripción' }
        }
      })
    })

    it('should use event id as message key', async () => {
      // Arrange
      const event = new __project_name_camel__DescriptionUpdatedEvent(
        'unique-id',
        DescriptionValueObject.create('Otra descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        '__project_name_camel__.description-updated',
        expect.objectContaining({
          key: 'unique-id'
        })
      )
    })

    it('should publish to correct kafka topic', async () => {
      // Arrange
      const event = new __project_name_camel__DescriptionUpdatedEvent(
        'test-id',
        DescriptionValueObject.create('Nueva descripción')
      )

      // Act
      await publisher.publish(event)

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(
        '__project_name_camel__.description-updated',
        expect.any(Object)
      )
    })

    it('should handle kafka producer errors', async () => {
      // Arrange
      const event = new __project_name_camel__DescriptionUpdatedEvent(
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
