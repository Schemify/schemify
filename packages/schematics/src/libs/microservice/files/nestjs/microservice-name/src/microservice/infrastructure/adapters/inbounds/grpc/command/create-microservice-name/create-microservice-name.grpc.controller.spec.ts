import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { microserviceName } from '@proto'

import { CreateMicroserviceNameGrpcController } from './create-microserviceName.grpc.controller'
import { CreateMicroserviceNameCommand } from '@microserviceName/microservice/application/ports/inbounds/commands'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('CreateMicroserviceNameGrpcController', () => {
  let controller: CreateMicroserviceNameGrpcController
  let commandBus: jest.Mocked<CommandBus>
  let mapper: jest.Mocked<MicroserviceNameMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateMicroserviceNameGrpcController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        },
        {
          provide: MicroserviceNameMapper,
          useValue: {
            entityToProto: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<CreateMicroserviceNameGrpcController>(
      CreateMicroserviceNameGrpcController
    )
    commandBus = module.get(CommandBus)
    mapper = module.get(MicroserviceNameMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createMicroserviceName', () => {
    it('should create microserviceName successfully with all fields', async () => {
      // Arrange
      const request: microserviceName.CreateMicroserviceNameDto = {
        name: 'MicroserviceName Test',
        description: 'Descripción del microserviceName'
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: request.name,
        description: request.description
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value,
        microserviceName: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicroserviceNameCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicroserviceNameCommand
      expect(executedCommand.name).toBe(request.name)
      expect(executedCommand.description).toBe(request.description)

      expect(result).toEqual(expectedResponse)
    })

    it('should create microserviceName without description', async () => {
      // Arrange
      const request: microserviceName.CreateMicroserviceNameDto = {
        name: 'MicroserviceName Sin Descripción'
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: request.name
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined,
        microserviceName: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicroserviceNameCommand
      expect(executedCommand.name).toBe(request.name)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: microserviceName.CreateMicroserviceNameDto = {
        name: 'MicroserviceName Error',
        description: 'Descripción'
      }

      const commandError = new Error('Command execution failed')
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.createMicroserviceName(request)
      ).rejects.toThrow('Command execution failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicroserviceNameCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const request: microserviceName.CreateMicroserviceNameDto = {
        name: 'MicroserviceName Mapper Error',
        description: 'Descripción'
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: request.name,
        description: request.description
      })

      const mapperError = new Error('Mapping failed')
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.createMicroserviceName(request)
      ).rejects.toThrow('Mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicroserviceNameCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty request data', async () => {
      // Arrange
      const request: microserviceName.CreateMicroserviceNameDto = {
        name: '',
        description: ''
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'Default Name'
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined,
        microserviceName: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicroserviceNameCommand
      expect(executedCommand.name).toBe('')
      expect(executedCommand.description).toBe('')

      expect(result).toEqual(expectedResponse)
    })

    it('should handle special characters in request', async () => {
      // Arrange
      const request: microserviceName.CreateMicroserviceNameDto = {
        name: 'MicroserviceName @#$%^&*()',
        description: 'Descripción con ñáéíóú'
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: request.name,
        description: request.description
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value,
        microserviceName: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicroserviceNameCommand
      expect(executedCommand.name).toBe('MicroserviceName @#$%^&*()')
      expect(executedCommand.description).toBe('Descripción con ñáéíóú')

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        CreateMicroserviceNameGrpcController
      )
      expect(commandBus).toBeDefined()
      expect(mapper).toBeDefined()
    })

    it('should have CommandBus injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toBeDefined()
      expect(typeof commandBus.execute).toBe('function')
    })

    it('should have MicroserviceNameMapper injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (
        request: microserviceName.CreateMicroserviceNameDto
      ) => {
        return controller.createMicroserviceName(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.createMicroserviceName.name).toBe(
        'createMicroserviceName'
      )
    })
  })
})
