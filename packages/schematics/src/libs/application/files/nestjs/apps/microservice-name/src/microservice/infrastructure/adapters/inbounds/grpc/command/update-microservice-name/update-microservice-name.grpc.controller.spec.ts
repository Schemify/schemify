import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { microservice_name } from '@proto'

import { UpdateMicroserviceNameGrpcController } from './updatemicroservice-name.grpc.controller'
import { UpdateMicroserviceNameCommand } from '@microserviceName/microservice/application/ports/inbounds/commands'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'
import { NameValueObject } from '@microserviceName/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from '@microserviceName/microservice/domain/value-objects/description.value-object'

describe('UpdateMicroserviceNameGrpcController', () => {
  let controller: UpdateMicroserviceNameGrpcController
  let commandBus: jest.Mocked<CommandBus>
  let mapper: jest.Mocked<MicroserviceNameMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateMicroserviceNameGrpcController],
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
            protoToProps: jest.fn(),
            entityToProto: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<UpdateMicroserviceNameGrpcController>(
      UpdateMicroserviceNameGrpcController
    )
    commandBus = module.get(CommandBus)
    mapper = module.get(MicroserviceNameMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('updateMicroserviceName', () => {
    it('should update microserviceName successfully with all fields', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'test-id-123',
        microserviceName: {
          name: 'MicroserviceName Actualizado',
          description: 'Nueva descripción del microserviceName'
        }
      }

      const mockProps = {
        name: NameValueObject.create('MicroserviceName Actualizado'),
        description: DescriptionValueObject.create(
          'Nueva descripción del microserviceName'
        )
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicroserviceNameCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicroserviceNameCommand
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBe(mockProps.description.value)

      expect(result).toEqual(expectedResponse)
    })

    it('should update microserviceName with only name field', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'test-id-456',
        microserviceName: {
          name: 'Solo Nombre Actualizado'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Solo Nombre Actualizado'),
        description: undefined
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: mockProps.name.value
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicroserviceNameCommand
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })

    it('should update microserviceName with only description field', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'test-id-789',
        microserviceName: {
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

      const mockEntity = MicroserviceNameEntity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicroserviceNameCommand
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBe(mockProps.description.value)

      expect(result).toEqual(expectedResponse)
    })

    it('should throw error when microserviceName object is missing', async () => {
      // Arrange
      const request = {
        id: 'test-id-123'
        // microserviceName is missing
      } as microserviceName.UpdateMicroserviceNameDto

      // Act & Assert
      await expect(
        controller.updateMicroserviceName(request)
      ).rejects.toThrow('Falta el objeto microserviceName en el payload')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).not.toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'non-existent-id',
        microserviceName: {
          name: 'MicroserviceName Error',
          description: 'Descripción'
        }
      }

      const mockProps = {
        name: NameValueObject.create('MicroserviceName Error'),
        description: DescriptionValueObject.create('Descripción')
      }

      const commandError = new Error('MicroserviceName not found')
      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.updateMicroserviceName(request)
      ).rejects.toThrow('MicroserviceName not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicroserviceNameCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during protoToProps', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'test-id-123',
        microserviceName: {
          name: 'MicroserviceName Mapper Error',
          description: 'Descripción'
        }
      }

      const mapperError = new Error('Invalid proto data')
      mapper.protoToProps.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.updateMicroserviceName(request)
      ).rejects.toThrow('Invalid proto data')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).not.toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entityToProto', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'test-id-123',
        microserviceName: {
          name: 'MicroserviceName Mapper Error',
          description: 'Descripción'
        }
      }

      const mockProps = {
        name: NameValueObject.create('MicroserviceName Mapper Error'),
        description: DescriptionValueObject.create('Descripción')
      }

      const mockEntity = MicroserviceNameEntity.create({
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
        controller.updateMicroserviceName(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicroserviceNameCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty microserviceName object with only name', async () => {
      // Arrange
      const request: microserviceName.UpdateMicroserviceNameDto = {
        id: 'test-id-123',
        microserviceName: {
          name: 'Nombre Original'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Nombre Original'),
        description: undefined
      }

      const mockEntity = MicroserviceNameEntity.create({
        name: mockProps.name.value
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicroserviceName(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.microserviceName
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicroserviceNameCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicroserviceNameCommand
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
        UpdateMicroserviceNameGrpcController
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
      expect(mapper.protoToProps).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.protoToProps).toBe('function')
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (
        request: microserviceName.UpdateMicroserviceNameDto
      ) => {
        return controller.updateMicroserviceName(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.updateMicroserviceName.name).toBe(
        'updateMicroserviceName'
      )
    })
  })
})
