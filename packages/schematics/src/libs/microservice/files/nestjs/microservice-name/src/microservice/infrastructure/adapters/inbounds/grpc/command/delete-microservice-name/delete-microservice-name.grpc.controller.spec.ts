import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { microserviceName } from '@proto'

import { DeleteMicroserviceNameGrpcController } from './delete-microserviceName.grpc.controller'
import { DeleteMicroserviceNameCommand } from '@microserviceName/microservice/application/ports/inbounds/commands'

describe('DeleteMicroserviceNameGrpcController', () => {
  let controller: DeleteMicroserviceNameGrpcController
  let commandBus: jest.Mocked<CommandBus>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteMicroserviceNameGrpcController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<DeleteMicroserviceNameGrpcController>(
      DeleteMicroserviceNameGrpcController
    )
    commandBus = module.get(CommandBus)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('deleteMicroserviceName', () => {
    it('should delete microserviceName successfully', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id-123'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicroserviceNameCommand
      expect(executedCommand.id).toBe(request.id)

      expect(result).toEqual({})
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'non-existent-id'
        }

      const commandError = new Error('MicroserviceName not found')
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.deleteMicroserviceName(request)
      ).rejects.toThrow('MicroserviceName not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicroserviceNameCommand)
      )
    })

    it('should handle empty ID', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: ''
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicroserviceNameCommand
      expect(executedCommand.id).toBe('')

      expect(result).toEqual({})
    })

    it('should handle UUID format ID', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: '550e8400-e29b-41d4-a716-446655440000'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicroserviceNameCommand
      expect(executedCommand.id).toBe('550e8400-e29b-41d4-a716-446655440000')

      expect(result).toEqual({})
    })

    it('should handle special characters in ID', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id-with-special-chars-@#$%^&*()'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicroserviceNameCommand
      expect(executedCommand.id).toBe('test-id-with-special-chars-@#$%^&*()')

      expect(result).toEqual({})
    })

    it('should handle very long ID', async () => {
      // Arrange
      const longId = 'a'.repeat(1000)
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: longId
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(DeleteMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as DeleteMicroserviceNameCommand
      expect(executedCommand.id).toBe(longId)

      expect(result).toEqual({})
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        DeleteMicroserviceNameGrpcController
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
        request: microserviceName.GetMicroserviceNameByIdDto
      ) => {
        return controller.deleteMicroserviceName(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.deleteMicroserviceName.name).toBe(
        'deleteMicroserviceName'
      )
    })

    it('should return empty object type', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id'
        }

      commandBus.execute.mockResolvedValue(undefined)

      // Act
      const result = await controller.deleteMicroserviceName(request)

      // Assert
      expect(result).toEqual({})
      expect(typeof result).toBe('object')
      expect(Object.keys(result)).toHaveLength(0)
    })
  })
})
