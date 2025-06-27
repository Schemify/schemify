import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { micromicro } from '@proto'

import { DeleteMicromicroGrpcController } from './delete-micromicro.grpc.controller'
import { DeleteMicromicroCommand } from '@micromicro/microservice/application/ports/inbounds/commands'

describe('DeleteMicromicroGrpcController', () => {
  let controller: DeleteMicromicroGrpcController
  let commandBus: jest.Mocked<CommandBus>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteMicromicroGrpcController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<DeleteMicromicroGrpcController>(
      DeleteMicromicroGrpcController
    )
    commandBus = module.get(CommandBus)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('deleteMicromicro', () => {
    it('should delete micromicro successfully', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id-123'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicromicroCommand
      expect(executedCommand.id).toBe(request.id)

      expect(result).toEqual({})
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'non-existent-id'
        }

      const commandError = new Error('Micromicro not found')
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.deleteMicromicro(request)
      ).rejects.toThrow('Micromicro not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicromicroCommand)
      )
    })

    it('should handle empty ID', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: ''
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicromicroCommand
      expect(executedCommand.id).toBe('')

      expect(result).toEqual({})
    })

    it('should handle UUID format ID', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: '550e8400-e29b-41d4-a716-446655440000'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicromicroCommand
      expect(executedCommand.id).toBe('550e8400-e29b-41d4-a716-446655440000')

      expect(result).toEqual({})
    })

    it('should handle special characters in ID', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id-with-special-chars-@#$%^&*()'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicromicroCommand
      expect(executedCommand.id).toBe('test-id-with-special-chars-@#$%^&*()')

      expect(result).toEqual({})
    })

    it('should handle very long ID', async () => {
      // Arrange
      const longId = 'a'.repeat(1000)
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: longId
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicromicroCommand
      expect(executedCommand.id).toBe(longId)

      expect(result).toEqual({})
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        DeleteMicromicroGrpcController
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
        request: micromicro.GetMicromicroByIdDto
      ) => {
        return controller.deleteMicromicro(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.deleteMicromicro.name).toBe(
        'deleteMicromicro'
      )
    })

    it('should return empty object type', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicromicro(request)

      // Assert
      expect(result).toEqual({})
      expect(typeof result).toBe('object')
      expect(Object.keys(result)).toHaveLength(0)
    })
  })
})
