import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { __project_name_kebab__ } from '@proto'

import { Create__project_name_pascal__GrpcController } from './create-__project_name_kebab__.grpc.controller'
import { Create__project_name_pascal__Command } from '@__project_name_kebab__/microservice/application/ports/inbounds/commands'
import { __project_name_pascal__Mapper } from '@__project_name_kebab__/microservice/infrastructure/mappers/__project_name_kebab__.mapper'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

describe('Create__project_name_pascal__GrpcController', () => {
  let controller: Create__project_name_pascal__GrpcController
  let commandBus: jest.Mocked<CommandBus>
  let mapper: jest.Mocked<__project_name_pascal__Mapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Create__project_name_pascal__GrpcController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        },
        {
          provide: __project_name_pascal__Mapper,
          useValue: {
            entityToProto: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<Create__project_name_pascal__GrpcController>(
      Create__project_name_pascal__GrpcController
    )
    commandBus = module.get(CommandBus)
    mapper = module.get(__project_name_pascal__Mapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create__project_name_pascal__', () => {
    it('should create __project_name_kebab__ successfully with all fields', async () => {
      // Arrange
      const request: __project_name_kebab__.Create__project_name_pascal__Dto = {
        name: 'Cliente Test',
        description: 'Descripción del cliente'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: request.name,
        description: request.description
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value,
        __project_name_kebab__: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.create__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Create__project_name_pascal__Command)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Create__project_name_pascal__Command
      expect(executedCommand.name).toBe(request.name)
      expect(executedCommand.description).toBe(request.description)

      expect(result).toEqual(expectedResponse)
    })

    it('should create __project_name_kebab__ without description', async () => {
      // Arrange
      const request: __project_name_kebab__.Create__project_name_pascal__Dto = {
        name: 'Cliente Sin Descripción'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: request.name
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined,
        __project_name_kebab__: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.create__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Create__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Create__project_name_pascal__Command
      expect(executedCommand.name).toBe(request.name)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: __project_name_kebab__.Create__project_name_pascal__Dto = {
        name: 'Cliente Error',
        description: 'Descripción'
      }

      const commandError = new Error('Command execution failed')
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(controller.create__project_name_pascal__(request)).rejects.toThrow(
        'Command execution failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Create__project_name_pascal__Command)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const request: __project_name_kebab__.Create__project_name_pascal__Dto = {
        name: 'Cliente Mapper Error',
        description: 'Descripción'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: request.name,
        description: request.description
      })

      const mapperError = new Error('Mapping failed')
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(controller.create__project_name_pascal__(request)).rejects.toThrow(
        'Mapping failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Create__project_name_pascal__Command)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty request data', async () => {
      // Arrange
      const request: __project_name_kebab__.Create__project_name_pascal__Dto = {
        name: '',
        description: ''
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Default Name'
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined,
        __project_name_kebab__: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.create__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Create__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Create__project_name_pascal__Command
      expect(executedCommand.name).toBe('')
      expect(executedCommand.description).toBe('')

      expect(result).toEqual(expectedResponse)
    })

    it('should handle special characters in request', async () => {
      // Arrange
      const request: __project_name_kebab__.Create__project_name_pascal__Dto = {
        name: 'Cliente @#$%^&*()',
        description: 'Descripción con ñáéíóú'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: request.name,
        description: request.description
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value,
        __project_name_kebab__: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.create__project_name_pascal__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Create__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Create__project_name_pascal__Command
      expect(executedCommand.name).toBe('Cliente @#$%^&*()')
      expect(executedCommand.description).toBe('Descripción con ñáéíóú')

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(Create__project_name_pascal__GrpcController)
      expect(commandBus).toBeDefined()
      expect(mapper).toBeDefined()
    })

    it('should have CommandBus injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toBeDefined()
      expect(typeof commandBus.execute).toBe('function')
    })

    it('should have __project_name_pascal__Mapper injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (request: __project_name_kebab__.Create__project_name_pascal__Dto) => {
        return controller.create__project_name_pascal__(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.create__project_name_pascal__.name).toBe('create__project_name_pascal__')
    })
  })
})
