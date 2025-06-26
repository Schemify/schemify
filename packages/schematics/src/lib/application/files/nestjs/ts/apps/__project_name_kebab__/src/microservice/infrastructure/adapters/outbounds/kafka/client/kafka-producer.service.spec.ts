/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from './kafka-producer.service'
import { __project_name_pascal__Kafka } from '@nestjs/microservices'
import { of, throwError } from 'rxjs'

describe('KafkaProducerService', () => {
  let service: KafkaProducerService
  let mock__project_name_pascal__Kafka: jest.Mocked<__project_name_pascal__Kafka>

  beforeEach(async () => {
    const mock__project_name_pascal__ = {
      connect: jest.fn().mockResolvedValue(undefined),
      emit: jest.fn().mockReturnValue(of({})),
      close: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_PRODUCER',
          useValue: mock__project_name_pascal__
        }
      ]
    }).compile()

    service = module.get<KafkaProducerService>(KafkaProducerService)
    mock__project_name_pascal__Kafka = module.get('KAFKA_PRODUCER')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('onModuleInit', () => {
    it('should connect to kafka on module init', async () => {
      // Act
      await service.onModuleInit()

      // Assert
      expect(mock__project_name_pascal__Kafka.connect).toHaveBeenCalledTimes(1)
      expect(service['ready']).toBe(true)
    })

    it('should not connect twice if already connected', async () => {
      // Arrange
      service['ready'] = true

      // Act
      await service.onModuleInit()

      // Assert
      expect(mock__project_name_pascal__Kafka.connect).not.toHaveBeenCalled()
    })

    it('should handle connection errors', async () => {
      // Arrange
      const connectionError = new Error('Connection failed')
      mock__project_name_pascal__Kafka.connect.mockRejectedValue(
        connectionError
      )

      // Act & Assert
      await expect(service.onModuleInit()).rejects.toThrow('Connection failed')
      expect(service['ready']).toBe(false)
    })
  })

  describe('emit', () => {
    it('should emit message successfully', async () => {
      // Arrange
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }
      const expectedResult = { success: true }
      mock__project_name_pascal__Kafka.emit.mockReturnValue(of(expectedResult))

      // Act
      const result = await service.emit(topic, payload)

      // Assert
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenCalledWith(
        topic,
        payload
      )
      expect(result).toEqual(expectedResult)
    })

    it('should connect before emitting if not ready', async () => {
      // Arrange
      service['ready'] = false
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }

      // Act
      await service.emit(topic, payload)

      // Assert
      expect(mock__project_name_pascal__Kafka.connect).toHaveBeenCalledTimes(1)
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenCalledWith(
        topic,
        payload
      )
      expect(service['ready']).toBe(true)
    })

    it('should not connect again if already ready', async () => {
      // Arrange
      service['ready'] = true
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }

      // Act
      await service.emit(topic, payload)

      // Assert
      expect(mock__project_name_pascal__Kafka.connect).not.toHaveBeenCalled()
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenCalledWith(
        topic,
        payload
      )
    })

    it('should handle emit errors', async () => {
      // Arrange
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }
      const emitError = new Error('Emit failed')
      mock__project_name_pascal__Kafka.emit.mockReturnValue(
        throwError(() => emitError)
      )

      // Act & Assert
      await expect(service.emit(topic, payload)).rejects.toThrow('Emit failed')
    })

    it('should handle connection errors during emit', async () => {
      // Arrange
      service['ready'] = false
      const connectionError = new Error('Connection failed')
      mock__project_name_pascal__Kafka.connect.mockRejectedValue(
        connectionError
      )
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }

      // Act & Assert
      await expect(service.emit(topic, payload)).rejects.toThrow(
        'Connection failed'
      )
      expect(mock__project_name_pascal__Kafka.emit).not.toHaveBeenCalled()
    })
  })

  describe('onApplicationShutdown', () => {
    it('should close kafka connection on shutdown', async () => {
      // Arrange
      service['ready'] = true

      // Act
      await service.onApplicationShutdown()

      // Assert
      expect(mock__project_name_pascal__Kafka.close).toHaveBeenCalledTimes(1)
    })

    it('should not close if not connected', async () => {
      // Arrange
      service['ready'] = false

      // Act
      await service.onApplicationShutdown()

      // Assert
      expect(mock__project_name_pascal__Kafka.close).not.toHaveBeenCalled()
    })

    it('should handle close errors gracefully', async () => {
      // Arrange
      service['ready'] = true
      const closeError = new Error('Close failed')
      mock__project_name_pascal__Kafka.close.mockRejectedValue(closeError)

      // Act & Assert
      await expect(service.onApplicationShutdown()).rejects.toThrow(
        'Close failed'
      )
    })
  })

  describe('integration scenarios', () => {
    it('should handle full lifecycle: connect -> emit -> close', async () => {
      // Arrange
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }
      const expectedResult = { success: true }
      mock__project_name_pascal__Kafka.emit.mockReturnValue(of(expectedResult))

      // Act
      await service.onModuleInit()
      const emitResult = await service.emit(topic, payload)
      await service.onApplicationShutdown()

      // Assert
      expect(mock__project_name_pascal__Kafka.connect).toHaveBeenCalledTimes(1)
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenCalledWith(
        topic,
        payload
      )
      expect(mock__project_name_pascal__Kafka.close).toHaveBeenCalledTimes(1)
      expect(emitResult).toEqual(expectedResult)
    })

    it('should handle multiple emits with single connection', async () => {
      // Arrange
      const topic1 = 'test.topic1'
      const topic2 = 'test.topic2'
      const payload1 = { key: 'key1', value: 'value1' }
      const payload2 = { key: 'key2', value: 'value2' }

      // Act
      await service.emit(topic1, payload1)
      await service.emit(topic2, payload2)

      // Assert
      expect(mock__project_name_pascal__Kafka.connect).toHaveBeenCalledTimes(1)
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenCalledTimes(2)
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenNthCalledWith(
        1,
        topic1,
        payload1
      )
      expect(mock__project_name_pascal__Kafka.emit).toHaveBeenNthCalledWith(
        2,
        topic2,
        payload2
      )
    })
  })
})
