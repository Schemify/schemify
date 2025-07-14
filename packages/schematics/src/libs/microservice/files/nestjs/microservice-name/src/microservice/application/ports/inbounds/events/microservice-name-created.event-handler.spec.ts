/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { MicroserviceNameCreatedEventHandler } from './microserviceName-created.event-handler'
import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { PrintMicroserviceNameInfoUseCase } from '@microserviceName/microservice/application/use-cases/messaging/kafka/print-microserviceName-info.use-case'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('MicroserviceNameCreatedEventHandler', () => {
  let handler: MicroserviceNameCreatedEventHandler
  let useCase: jest.Mocked<PrintMicroserviceNameInfoUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroserviceNameCreatedEventHandler,
        {
          provide: PrintMicroserviceNameInfoUseCase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(MicroserviceNameCreatedEventHandler)
    useCase = module.get(PrintMicroserviceNameInfoUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handle', () => {
    it('should handle MicroserviceNameCreatedEvent successfully', async () => {
      // Arrange
      const microserviceNameEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Test',
        description: 'Descripción del microserviceName'
      })
      const event = new MicroserviceNameCreatedEvent(microserviceNameEntity)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })

    it('should handle event with microserviceName without description', async () => {
      // Arrange
      const microserviceNameEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Sin Descripción'
      })
      const event = new MicroserviceNameCreatedEvent(microserviceNameEntity)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
      expect(event.microserviceName).toBe(microserviceNameEntity)
      expect(event.occurredAt).toBeInstanceOf(Date)
    })

    it('should propagate use case errors', async () => {
      // Arrange
      const microserviceNameEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Error',
        description: 'Descripción'
      })
      const event = new MicroserviceNameCreatedEvent(microserviceNameEntity)
      const useCaseError = new Error('Kafka publishing failed')

      useCase.execute.mockRejectedValue(useCaseError)

      // Act & Assert
      await expect(handler.handle(event)).rejects.toThrow(
        'Kafka publishing failed'
      )
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })

    it('should handle multiple events in sequence', async () => {
      // Arrange
      const microserviceName1 = MicroserviceNameEntity.create({
        name: 'MicroserviceName 1'
      })
      const microserviceName2 = MicroserviceNameEntity.create({
        name: 'MicroserviceName 2'
      })
      const event1 = new MicroserviceNameCreatedEvent(microserviceName1)
      const event2 = new MicroserviceNameCreatedEvent(microserviceName2)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event1)
      await handler.handle(event2)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(2)
      expect(useCase.execute).toHaveBeenNthCalledWith(1, event1)
      expect(useCase.execute).toHaveBeenNthCalledWith(2, event2)
    })

    it('should preserve event properties correctly', async () => {
      // Arrange
      const microserviceNameEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Verificación',
        description: 'Verificar propiedades'
      })
      const event = new MicroserviceNameCreatedEvent(microserviceNameEntity)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(event.microserviceName).toBe(microserviceNameEntity)
      expect(event.microserviceName.props.name.value).toBe(
        'MicroserviceName Verificación'
      )
      expect(event.microserviceName.props.description?.value).toBe(
        'Verificar propiedades'
      )
      expect(event.occurredAt).toBeInstanceOf(Date)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })
  })
})
