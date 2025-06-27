import { Test, TestingModule } from '@nestjs/testing'
import { CommandBus } from '@nestjs/cqrs'

import { micromicro } from '@proto'

import { CreateMicromicroGrpcController } from './create-micromicro.grpc.controller'
import { CreateMicromicroCommand } from '@micromicro/microservice/application/ports/inbounds/commands'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('CreateMicromicroGrpcController', () => {
  let controller: CreateMicromicroGrpcController
  let commandBus: jest.Mocked<CommandBus>
  let mapper: jest.Mocked<MicromicroMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateMicromicroGrpcController],
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
            entityToProto: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<CreateMicromicroGrpcController>(
      CreateMicromicroGrpcController
    )
    commandBus = module.get(CommandBus)
    mapper = module.get(MicromicroMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createMicromicro', () => {
    it('should create micromicro successfully with all fields', async () => {
      // Arrange
      const request: micromicro.CreateMicromicroDto = {
        name: 'Micromicro Test',
        description: 'Descripción del micromicro'
      }

      const mockEntity = MicromicroEntity.create({
        name: request.name,
        description: request.description
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value,
        micromicro: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicromicroCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicromicroCommand
      expect(executedCommand.name).toBe(request.name)
      expect(executedCommand.description).toBe(request.description)

      expect(result).toEqual(expectedResponse)
    })

    it('should create micromicro without description', async () => {
      // Arrange
      const request: micromicro.CreateMicromicroDto = {
        name: 'Micromicro Sin Descripción'
      }

      const mockEntity = MicromicroEntity.create({
        name: request.name
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined,
        micromicro: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicromicroCommand
      expect(executedCommand.name).toBe(request.name)
      expect(executedCommand.description).toBeUndefined()

      expect(result).toEqual(expectedResponse)
    })

    it('should handle command bus errors', async () => {
      // Arrange
      const request: micromicro.CreateMicromicroDto = {
        name: 'Micromicro Error',
        description: 'Descripción'
      }

      const commandError = new Error('Command execution failed')
      commandBus.execute.mockRejectedValue(commandError)

      // Act & Assert
      await expect(
        controller.createMicromicro(request)
      ).rejects.toThrow('Command execution failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicromicroCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const request: micromicro.CreateMicromicroDto = {
        name: 'Micromicro Mapper Error',
        description: 'Descripción'
      }

      const mockEntity = MicromicroEntity.create({
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
        controller.createMicromicro(request)
      ).rejects.toThrow('Mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicromicroCommand)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty request data', async () => {
      // Arrange
      const request: micromicro.CreateMicromicroDto = {
        name: '',
        description: ''
      }

      const mockEntity = MicromicroEntity.create({
        name: 'Default Name'
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined,
        micromicro: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicromicroCommand
      expect(executedCommand.name).toBe('')
      expect(executedCommand.description).toBe('')

      expect(result).toEqual(expectedResponse)
    })

    it('should handle special characters in request', async () => {
      // Arrange
      const request: micromicro.CreateMicromicroDto = {
        name: 'Micromicro @#$%^&*()',
        description: 'Descripción con ñáéíóú'
      }

      const mockEntity = MicromicroEntity.create({
        name: request.name,
        description: request.description
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value,
        micromicro: []
      }

      commandBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.createMicromicro(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateMicromicroCommand)
      )

      const executedCommand = commandBus.execute.mock
        .calls[0][0] as CreateMicromicroCommand
      expect(executedCommand.name).toBe('Micromicro @#$%^&*()')
      expect(executedCommand.description).toBe('Descripción con ñáéíóú')

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        CreateMicromicroGrpcController
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
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (
        request: micromicro.CreateMicromicroDto
      ) => {
        return controller.createMicromicro(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.createMicromicro.name).toBe(
        'createMicromicro'
      )
    })
  })
})
