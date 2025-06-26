/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { __project_name_pascal__CreatedEventHandler } from './__project_name_kebab__-created.event-handler'
import { __project_name_pascal__CreatedEvent } from '@__project_name_kebab__/microservice/domain/events/__project_name_kebab__-created.event'
import { Print__project_name_pascal__InfoUseCase } from '@__project_name_kebab__/microservice/application/use-cases/messaging/kafka/print-__project_name_kebab__-info.use-case'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

describe('__project_name_pascal__CreatedEventHandler', () => {
  let handler: __project_name_pascal__CreatedEventHandler
  let useCase: jest.Mocked<Print__project_name_pascal__InfoUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        __project_name_pascal__CreatedEventHandler,
        {
          provide: Print__project_name_pascal__InfoUseCase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(__project_name_pascal__CreatedEventHandler)
    useCase = module.get(Print__project_name_pascal__InfoUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('handle', () => {
    it('should handle __project_name_pascal__CreatedEvent successfully', async () => {
      // Arrange
      const clientEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Test',
        description: 'Descripción del cliente'
      })
      const event = new __project_name_pascal__CreatedEvent(clientEntity)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })

    it('should handle event with client without description', async () => {
      // Arrange
      const clientEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Sin Descripción'
      })
      const event = new __project_name_pascal__CreatedEvent(clientEntity)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(useCase.execute).toHaveBeenCalledTimes(1)
      expect(useCase.execute).toHaveBeenCalledWith(event)
      expect(event.__project_name_kebab__).toBe(clientEntity)
      expect(event.occurredAt).toBeInstanceOf(Date)
    })

    it('should propagate use case errors', async () => {
      // Arrange
      const clientEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Error',
        description: 'Descripción'
      })
      const event = new __project_name_pascal__CreatedEvent(clientEntity)
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
      const client1 = __project_name_pascal__Entity.create({ name: 'Cliente 1' })
      const client2 = __project_name_pascal__Entity.create({ name: 'Cliente 2' })
      const event1 = new __project_name_pascal__CreatedEvent(client1)
      const event2 = new __project_name_pascal__CreatedEvent(client2)

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
      const clientEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Verificación',
        description: 'Verificar propiedades'
      })
      const event = new __project_name_pascal__CreatedEvent(clientEntity)

      useCase.execute.mockResolvedValue(undefined)

      // Act
      await handler.handle(event)

      // Assert
      expect(event.__project_name_kebab__).toBe(clientEntity)
      expect(event.__project_name_camel__.props.name.value).toBe('Cliente Verificación')
      expect(event.__project_name_camel__.props.description?.value).toBe(
        'Verificar propiedades'
      )
      expect(event.occurredAt).toBeInstanceOf(Date)
      expect(useCase.execute).toHaveBeenCalledWith(event)
    })
  })
})
