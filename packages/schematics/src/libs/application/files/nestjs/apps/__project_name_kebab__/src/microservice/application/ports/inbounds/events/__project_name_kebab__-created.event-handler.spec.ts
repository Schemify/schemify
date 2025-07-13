/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { __project_name_camel__CreatedEventHandler } from './__project_name_kebab__-created.event-handler'
import { __project_name_camel__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'
import { Print__project_name_camel__InfoUseCase } from '@__project_name_camel__/microservice/application/use-cases/messaging/kafka/print__project_name_kebab__-info.use-case'
import { __project_name_camel__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('__project_name_camel__CreatedEventHandler', () => {
  let handler: __project_name_camel__CreatedEventHandler
  let useCase: jest.Mocked<Print__project_name_camel__InfoUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        __project_name_camel__CreatedEventHandler,
        {
          provide: Print__project_name_camel__InfoUseCase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(__project_name_camel__CreatedEventHandler)
    useCase = module.get(Print__project_name_camel__InfoUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handle', () => {
    it('should handle __project_name_camel__CreatedEvent successfully', async () => {
      // Arrange
      const __project_name_camel__Entity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Test',
        description: 'Descripción del __project_name_camel__'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__Entity
      )

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })

    it('should handle event with __project_name_camel__ without description', async () => {
      // Arrange
      const __project_name_camel__Entity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Sin Descripción'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__Entity
      )

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
      expect(event.__project_name_camel__).toBe(__project_name_camel__Entity)
      expect(event.occurredAt).toBeInstanceOf(Date)
    })

    it('should propagate use case errors', async () => {
      // Arrange
      const __project_name_camel__Entity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Error',
        description: 'Descripción'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__Entity
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
      const __project_name_camel__1 = __project_name_camel__Entity.create({
        name: '__project_name_camel__ 1'
      })
      const __project_name_camel__2 = __project_name_camel__Entity.create({
        name: '__project_name_camel__ 2'
      })
      const event1 = new __project_name_camel__CreatedEvent(
        __project_name_camel__1
      )
      const event2 = new __project_name_camel__CreatedEvent(
        __project_name_camel__2
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
      const __project_name_camel__Entity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Verificación',
        description: 'Verificar propiedades'
      })
      const event = new __project_name_camel__CreatedEvent(
        __project_name_camel__Entity
      )

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(event.__project_name_camel__).toBe(__project_name_camel__Entity)
      expect(event.__project_name_camel__.props.name.value).toBe(
        '__project_name_camel__ Verificación'
      )
      expect(event.__project_name_camel__.props.description?.value).toBe(
        'Verificar propiedades'
      )
      expect(event.occurredAt).toBeInstanceOf(Date)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })
  })
})
