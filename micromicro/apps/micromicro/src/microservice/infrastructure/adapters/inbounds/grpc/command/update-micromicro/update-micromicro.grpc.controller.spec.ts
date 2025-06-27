import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { micromicro } from '@proto'

import { UpdateMicromicroGrpcController } from './update-micromicro.grpc.controller'
import { UpdateMicromicroCommand } from '@micromicro/microservice/application/ports/inbounds/commands'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'
import { NameValueObject } from '@micromicro/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from '@micromicro/microservice/domain/value-objects/description.value-object'

describe('UpdateMicromicroGrpcController', () => {
  let controller: UpdateMicromicroGrpcController
  let commandBus: jest.Mocked<CommandBus>
  let mapper: jest.Mocked<MicromicroMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateMicromicroGrpcController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn()
          }
        },
        {
          provide: MicromicroMapper,
          useValue: {
            protoToProps: jest.fn(),
            entityToProto: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<UpdateMicromicroGrpcController>(
      UpdateMicromicroGrpcController
    )
    commandBus = module.get(CommandBus)
    mapper = module.get(MicromicroMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('updateMicromicro', () => {
    it('should update micromicro successfully with all fields', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'test-id-123',
        micromicro: {
          name: 'Micromicro Actualizado',
          description: 'Nueva descripción del micromicro'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Micromicro Actualizado'),
        description: DescriptionValueObject.create(
          'Nueva descripción del micromicro'
        )
      }

      const mockEntity = MicromicroEntity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicromicroCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicromicroCommand
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBe(mockProps.description.value)

      expect(result).toEqual(expectedResponse)
    })

    it('should update micromicro with only name field', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'test-id-456',
        micromicro: {
          name: 'Solo Nombre Actualizado'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Solo Nombre Actualizado'),
        description: undefined
      }

      const mockEntity = MicromicroEntity.create({
        name: mockProps.name.value
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicromicroCommand
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })

    it('should update micromicro with only description field', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'test-id-789',
        micromicro: {
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

      const mockEntity = MicromicroEntity.create({
        name: mockProps.name.value,
        description: mockProps.description.value
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicromicroCommand
      expect(executedCommand.id).toBe(request.id)
      expect(executedCommand.name).toBe(mockProps.name.value)
      expect(executedCommand.description).toBe(mockProps.description.value)

      expect(result).toEqual(expectedResponse)
    })

    it('should throw error when micromicro object is missing', async () => {
      // Arrange
      const request = {
        id: 'test-id-123'
        // micromicro is missing
      } as micromicro.UpdateMicromicroDto

      // Act & Assert
      await expect(
        controller.updateMicromicro(request)
      ).rejects.toThrow('Falta el objeto micromicro en el payload')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).not.toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'non-existent-id',
        micromicro: {
          name: 'Micromicro Error',
          description: 'Descripción'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Micromicro Error'),
        description: DescriptionValueObject.create('Descripción')
      }

      const commandError = new Error('Micromicro not found')
      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.updateMicromicro(request)
      ).rejects.toThrow('Micromicro not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicromicroCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during protoToProps', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'test-id-123',
        micromicro: {
          name: 'Micromicro Mapper Error',
          description: 'Descripción'
        }
      }

      const mapperError = new Error('Invalid proto data')
      mapper.protoToProps.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.updateMicromicro(request)
      ).rejects.toThrow('Invalid proto data')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).not.toHaveBeenCalled()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entityToProto', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'test-id-123',
        micromicro: {
          name: 'Micromicro Mapper Error',
          description: 'Descripción'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Micromicro Mapper Error'),
        description: DescriptionValueObject.create('Descripción')
      }

      const mockEntity = MicromicroEntity.create({
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
        controller.updateMicromicro(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicromicroCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty micromicro object with only name', async () => {
      // Arrange
      const request: micromicro.UpdateMicromicroDto = {
        id: 'test-id-123',
        micromicro: {
          name: 'Nombre Original'
        }
      }

      const mockProps = {
        name: NameValueObject.create('Nombre Original'),
        description: undefined
      }

      const mockEntity = MicromicroEntity.create({
        name: mockProps.name.value
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      mapper.protoToProps.mockReturnValue(mockProps)
      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.updateMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.protoToProps).toHaveBeenCalledWith(
        request.micromicro
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(UpdateMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as UpdateMicromicroCommand
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
        UpdateMicromicroGrpcController
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

    it('should have MicromicroMapper injected', () => {
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
        request: micromicro.UpdateMicromicroDto
      ) => {
        return controller.updateMicromicro(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.updateMicromicro.name).toBe(
        'updateMicromicro'
      )
    })
  })
})
