import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { __project_name_camel__ } from '@proto'

import { Delete__project_name_pascal__GrpcController } from './delete-__project_name_camel__.grpc.controller'
import { Delete__project_name_pascal__Command } from '@__project_name_camel__/microservice/application/ports/inbounds/commands'

describe('Delete__project_name_pascal__GrpcController', () => {
  let controller: Delete__project_name_pascal__GrpcController
  let commandBus: jest.Mocked<CommandBus>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Delete__project_name_pascal__GrpcController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<Delete__project_name_pascal__GrpcController>(
      Delete__project_name_pascal__GrpcController
    )
    commandBus = module.get(CommandBus)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('delete__project_name_pascal__', () => {
    it('should delete __project_name_camel__ successfully', async () => {
      // Arrange
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: 'test-id-123'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.delete__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Delete__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Delete__project_name_pascal__Command
      expect(executedCommand.id).toBe(request.id)

      expect(result).toEqual({})
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: 'non-existent-id'
        }

      const commandError = new Error('__project_name_pascal__ not found')
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.delete__project_name_pascal__(request)
      ).rejects.toThrow('__project_name_pascal__ not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Delete__project_name_pascal__Command)
      )
    })

    it('should handle empty ID', async () => {
      // Arrange
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: ''
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.delete__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Delete__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Delete__project_name_pascal__Command
      expect(executedCommand.id).toBe('')

      expect(result).toEqual({})
    })

    it('should handle UUID format ID', async () => {
      // Arrange
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: '550e8400-e29b-41d4-a716-446655440000'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.delete__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Delete__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Delete__project_name_pascal__Command
      expect(executedCommand.id).toBe('550e8400-e29b-41d4-a716-446655440000')

      expect(result).toEqual({})
    })

    it('should handle special characters in ID', async () => {
      // Arrange
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: 'test-id-with-special-chars-@#$%^&*()'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.delete__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Delete__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Delete__project_name_pascal__Command
      expect(executedCommand.id).toBe('test-id-with-special-chars-@#$%^&*()')

      expect(result).toEqual({})
    })

    it('should handle very long ID', async () => {
      // Arrange
      const longId = 'a'.repeat(1000)
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: longId
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.delete__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Delete__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Delete__project_name_pascal__Command
      expect(executedCommand.id).toBe(longId)

      expect(result).toEqual({})
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        Delete__project_name_pascal__GrpcController
      )
      expect(commandBus).toBeDefined()
    })

    it('should have CommandBus injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toBeDefined()
      expect(typeof commandBus.execute).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (
        request: __project_name_camel__.Get__project_name_pascal__ByIdDto
      ) => {
        return controller.delete__project_name_pascal__(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.delete__project_name_pascal__.name).toBe(
        'delete__project_name_pascal__'
      )
    })

    it('should return empty object type', async () => {
      // Arrange
      const request: __project_name_camel__.Get__project_name_pascal__ByIdDto =
        {
          id: 'test-id'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.delete__project_name_pascal__(request)

      // Assert
      expect(result).toEqual({})
      expect(typeof result).toBe('object')
      expect(Object.keys(result)).toHaveLength(0)
    })
  })
})
