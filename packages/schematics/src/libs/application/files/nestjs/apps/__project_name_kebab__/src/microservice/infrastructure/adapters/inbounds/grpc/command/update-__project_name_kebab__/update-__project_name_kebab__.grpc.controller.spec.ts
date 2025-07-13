import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { __project_name_snake__ } from '@proto'

import { Update__project_name_camel__GrpcController } from './update__project_name_kebab__.grpc.controller'
import { Update__project_name_pascal__Command } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/commands'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'
import { __project_name_camel__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'
import { NameValueObject } from 'apps/__project_name_kebab__/src/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from 'apps/__project_name_kebab__/src/microservice/domain/value-objects/description.value-object'

describe('Update__project_name_camel__GrpcController', () => {
  let controller: Update__project_name_camel__GrpcController
  let commandBus: jest.Mocked<CommandBus>
  let mapper: jest.Mocked<__project_name_pascal__Mapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Update__project_name_camel__GrpcController],
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
            protoToProps: jest.fn(),
            entityToProto: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<Update__project_name_camel__GrpcController>(
      Update__project_name_camel__GrpcController
    )
    commandBus = module.get(CommandBus)
    mapper = module.get(__project_name_pascal__Mapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('update__project_name_camel__', () => {
    it('should update __project_name_camel__ successfully with all fields', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'test-id-123',
        __project_name_camel__: {
          name: '__project_name_camel__ Actualizado',
          description: 'Nueva descripción del __project_name_camel__'
        }
      }

      const mockProps = {
        name: NameValueObject.create('__project_name_camel__ Actualizado'),
        description: DescriptionValueObject.create(
          'Nueva descripción del __project_name_camel__'
        )
      }

      const mockEntity = __project_name_camel__Entity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.update__project_name_camel__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Update__project_name_pascal__Command)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Update__project_name_pascal__Command
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBe(mockProps.description.value)

      expect(result).toEqual(expectedResponse)
    })

    it('should update __project_name_camel__ with only name field', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'test-id-456',
        __project_name_camel__: {
          name: 'Solo Nombre Actualizado'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Solo Nombre Actualizado'),
        description: undefined
      }

      const mockEntity = __project_name_camel__Entity.create({
        name: mockProps.name.value
      })

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.update__project_name_camel__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Update__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Update__project_name_pascal__Command
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })

    it('should update __project_name_camel__ with only description field', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'test-id-789',
        __project_name_camel__: {
          name: 'Nombre Original',
          description: 'Solo descripción actualizada'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Nombre Original'),
        description: DescriptionValueObject.create(
          'Solo descripción actualizada'
        )
      }

      const mockEntity = __project_name_camel__Entity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.update__project_name_camel__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Update__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Update__project_name_pascal__Command
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBe(mockProps.description.value)

      expect(result).toEqual(expectedResponse)
    })

    it('should throw error when __project_name_camel__ object is missing', async () => {
      // Arrange
      const request = {
        id: 'test-id-123'
        // __project_name_camel__ is missing
      } as __project_name_camel__.Update__project_name_camel__Dto

      // Act & Assert
      await expect(
        controller.update__project_name_camel__(request)
      ).rejects.toThrow('Falta el objeto __project_name_camel__ en el payload')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).not.toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'non-existent-id',
        __project_name_camel__: {
          name: '__project_name_camel__ Error',
          description: 'Descripción'
        }
      }

      const mockProps = {
        name: NameValueObject.create('__project_name_camel__ Error'),
        description: DescriptionValueObject.create('Descripción')
      }

      const commandError = new Error('__project_name_camel__ not found')
      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.update__project_name_camel__(request)
      ).rejects.toThrow('__project_name_camel__ not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Update__project_name_pascal__Command)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during protoToProps', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'test-id-123',
        __project_name_camel__: {
          name: '__project_name_camel__ Mapper Error',
          description: 'Descripción'
        }
      }

      const mapperError = new Error('Invalid proto data')
      mapper.protoToProps.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.update__project_name_camel__(request)
      ).rejects.toThrow('Invalid proto data')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).not.toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entityToProto', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'test-id-123',
        __project_name_camel__: {
          name: '__project_name_camel__ Mapper Error',
          description: 'Descripción'
        }
      }

      const mockProps = {
        name: NameValueObject.create('__project_name_camel__ Mapper Error'),
        description: DescriptionValueObject.create('Descripción')
      }

      const mockEntity = __project_name_camel__Entity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const mapperError = new Error('Entity to proto mapping failed')
      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.update__project_name_camel__(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Update__project_name_pascal__Command)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty __project_name_camel__ object with only name', async () => {
      // Arrange
      const request: __project_name_camel__.Update__project_name_camel__Dto = {
        id: 'test-id-123',
        __project_name_camel__: {
          name: 'Nombre Original'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Nombre Original'),
        description: undefined
      }

      const mockEntity = __project_name_camel__Entity.create({
        name: mockProps.name.value
      })

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.update__project_name_camel__(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.__project_name_camel__
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(Update__project_name_pascal__Command)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as Update__project_name_pascal__Command
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        Update__project_name_camel__GrpcController
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

    it('should have __project_name_pascal__Mapper injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.protoToProps).toBe('function')
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (
        request: __project_name_camel__.Update__project_name_camel__Dto
      ) => {
        return controller.update__project_name_camel__(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.update__project_name_camel__.name).toBe(
        'update__project_name_camel__'
      )
    })
  })
})
