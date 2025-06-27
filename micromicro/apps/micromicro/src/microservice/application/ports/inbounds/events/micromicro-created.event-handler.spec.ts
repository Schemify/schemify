/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { MicromicroCreatedEventHandler } from './micromicro-created.event-handler'
import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { PrintMicromicroInfoUseCase } from '@micromicro/microservice/application/use-cases/messaging/kafka/print-micromicro-info.use-case'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('MicromicroCreatedEventHandler', () => {
  let handler: MicromicroCreatedEventHandler
  let useCase: jest.Mocked<PrintMicromicroInfoUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicromicroCreatedEventHandler,
        {
          provide: PrintMicromicroInfoUseCase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(MicromicroCreatedEventHandler)
    useCase = module.get(PrintMicromicroInfoUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handle', () => {
    it('should handle MicromicroCreatedEvent successfully', async () => {
      // Arrange
      const micromicroEntity = MicromicroEntity.create(
        {
          name: 'Micromicro Test',
          description: 'Descripción del micromicro'
        }
      )
      const event = new MicromicroCreatedEvent(
        micromicroEntity
      )

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })

    it('should handle event with micromicro without description', async () => {
      // Arrange
      const micromicroEntity = MicromicroEntity.create(
        {
          name: 'Micromicro Sin Descripción'
        }
      )
      const event = new MicromicroCreatedEvent(
        micromicroEntity
      )

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
      expect(event.micromicro).toBe(micromicroEntity)
      expect(event.occurredAt).toBeInstanceOf(Date)
    })

    it('should propagate use case errors', async () => {
      // Arrange
      const micromicroEntity = MicromicroEntity.create(
        {
          name: 'Micromicro Error',
          description: 'Descripción'
        }
      )
      const event = new MicromicroCreatedEvent(
        micromicroEntity
      )
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
      const micromicro1 = MicromicroEntity.create({
        name: 'Micromicro 1'
      })
      const micromicro2 = MicromicroEntity.create({
        name: 'Micromicro 2'
      })
      const event1 = new MicromicroCreatedEvent(
        micromicro1
      )
      const event2 = new MicromicroCreatedEvent(
        micromicro2
      )

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
      const micromicroEntity = MicromicroEntity.create(
        {
          name: 'Micromicro Verificación',
          description: 'Verificar propiedades'
        }
      )
      const event = new MicromicroCreatedEvent(
        micromicroEntity
      )

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(event.micromicro).toBe(micromicroEntity)
      expect(event.micromicro.props.name.value).toBe(
        'Micromicro Verificación'
      )
      expect(event.micromicro.props.description?.value).toBe(
        'Verificar propiedades'
      )
      expect(event.occurredAt).toBeInstanceOf(Date)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })
  })
})
