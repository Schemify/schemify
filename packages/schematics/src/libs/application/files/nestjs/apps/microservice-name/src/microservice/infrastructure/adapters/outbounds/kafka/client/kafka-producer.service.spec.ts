/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { KafkaProducerService } from './kafka-producer.service'
import { MicroserviceNameKafka } from '@nestjs/microservices'
import { of, throwError } from 'rxjs'

describe('KafkaProducerService', () => {
  let service: KafkaProducerService
  let mockMicroserviceNameKafka: jest.Mocked<MicroserviceNameKafka>

  beforeEach(async () => {
    const mockMicroserviceName = {
      connect: jest.fn().mockResolvedValue(undefined),
      emit: jest.fn().mockReturnValue(of({})),
      close: jest.fn().mockResolvedValue(undefined)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_PRODUCER',
          useValue: mockMicroserviceName
        }
      ]
    }).compile()

    service = module.get<KafkaProducerService>(KafkaProducerService)
    mockMicroserviceNameKafka = module.get('KAFKA_PRODUCER')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('onModuleInit', () => {
    it('should connect to kafka on module init', async () => {
      // Act
      await service.onModuleInit()

      // Assert
      expect(mockMicroserviceNameKafka.connect).toHaveBeenCalledTimes(1)
      expect(service['ready']).toBe(true)
    })

    it('should not connect twice if already connected', async () => {
      // Arrange
      service['ready'] = true

      // Act
      await service.onModuleInit()

      // Assert
      expect(mockMicroserviceNameKafka.connect).not.toHaveBeenCalled()
    })

    it('should handle connection errors', async () => {
      // Arrange
      const connectionError = new Error('Connection failed')
      mockMicroserviceNameKafka.connect.mockRejectedValue(
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
      mockMicroserviceNameKafka.emit.mockReturnValue(of(expectedResult))

      // Act
      const result = await service.emit(topic, payload)

      // Assert
      expect(mockMicroserviceNameKafka.emit).toHaveBeenCalledWith(
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
      expect(mockMicroserviceNameKafka.connect).toHaveBeenCalledTimes(1)
      expect(mockMicroserviceNameKafka.emit).toHaveBeenCalledWith(
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
      expect(mockMicroserviceNameKafka.connect).not.toHaveBeenCalled()
      expect(mockMicroserviceNameKafka.emit).toHaveBeenCalledWith(
        topic,
        payload
      )
    })

    it('should handle emit errors', async () => {
      // Arrange
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }
      const emitError = new Error('Emit failed')
      mockMicroserviceNameKafka.emit.mockReturnValue(
        throwError(() => emitError)
      )

      // Act & Assert
      await expect(service.emit(topic, payload)).rejects.toThrow('Emit failed')
    })

    it('should handle connection errors during emit', async () => {
      // Arrange
      service['ready'] = false
      const connectionError = new Error('Connection failed')
      mockMicroserviceNameKafka.connect.mockRejectedValue(
        connectionError
      )
      const topic = 'test.topic'
      const payload = { key: 'test-key', value: 'test-value' }

      // Act & Assert
      await expect(service.emit(topic, payload)).rejects.toThrow(
        'Connection failed'
      )
      expect(mockMicroserviceNameKafka.emit).not.toHaveBeenCalled()
    })
  })

  describe('onApplicationShutdown', () => {
    it('should close kafka connection on shutdown', async () => {
      // Arrange
      service['ready'] = true

      // Act
      await service.onApplicationShutdown()

      // Assert
      expect(mockMicroserviceNameKafka.close).toHaveBeenCalledTimes(1)
    })

    it('should not close if not connected', async () => {
      // Arrange
      service['ready'] = false

      // Act
      await service.onApplicationShutdown()

      // Assert
      expect(mockMicroserviceNameKafka.close).not.toHaveBeenCalled()
    })

    it('should handle close errors gracefully', async () => {
      // Arrange
      service['ready'] = true
      const closeError = new Error('Close failed')
      mockMicroserviceNameKafka.close.mockRejectedValue(closeError)

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
      mockMicroserviceNameKafka.emit.mockReturnValue(of(expectedResult))

      // Act
      await service.onModuleInit()
      const emitResult = await service.emit(topic, payload)
      await service.onApplicationShutdown()

      // Assert
      expect(mockMicroserviceNameKafka.connect).toHaveBeenCalledTimes(1)
      expect(mockMicroserviceNameKafka.emit).toHaveBeenCalledWith(
        topic,
        payload
      )
      expect(mockMicroserviceNameKafka.close).toHaveBeenCalledTimes(1)
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
      expect(mockMicroserviceNameKafka.connect).toHaveBeenCalledTimes(1)
      expect(mockMicroserviceNameKafka.emit).toHaveBeenCalledTimes(2)
      expect(mockMicroserviceNameKafka.emit).toHaveBeenNthCalledWith(
        1,
        topic1,
        payload1
      )
      expect(mockMicroserviceNameKafka.emit).toHaveBeenNthCalledWith(
        2,
        topic2,
        payload2
      )
    })
  })
})
