import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { micromicro } from '@proto'

import { GetMicromicroByIdGrpcController } from './get-micromicro-by-id.grpc.controller'
import { GetMicromicroByIdQuery } from '@micromicro/microservice/application/ports/inbounds/queries'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('GetMicromicroByIdGrpcController', () => {
  let controller: GetMicromicroByIdGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<MicromicroMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMicromicroByIdGrpcController],
      providers: [
        {
          provide: QueryBus,
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

    controller = module.get<GetMicromicroByIdGrpcController>(
      GetMicromicroByIdGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(MicromicroMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getMicromicroById', () => {
    it('should return micromicro successfully with all fields', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id-123'
        }

      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Test',
        description: 'Descripción del micromicro'
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicromicroById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByIdQuery
      expect(executedQuery.payload.id).toBe(request.id)

      expect(result).toEqual(expectedResponse)
    })

    it('should return micromicro without description', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id-456'
        }

      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Sin Descripción'
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicromicroById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.description).toBeUndefined()
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'non-existent-id'
        }

      const queryError = new Error('Micromicro not found')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.getMicromicroById(request)
      ).rejects.toThrow('Micromicro not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id-789'
        }

      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Mapper Error',
        description: 'Descripción'
      })

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.getMicromicroById(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty id', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: ''
        }

      const queryError = new Error('Invalid micromicro ID')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.getMicromicroById(request)
      ).rejects.toThrow('Invalid micromicro ID')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByIdQuery
      expect(executedQuery.payload.id).toBe('')
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'test-id-@#$%^&*()'
        }

      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Especial',
        description: 'Descripción con caracteres especiales'
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicromicroById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByIdQuery
      expect(executedQuery.payload.id).toBe('test-id-@#$%^&*()')

      expect(result).toEqual(expectedResponse)
    })

    it('should handle very long id', async () => {
      // Arrange
      const longId = 'a'.repeat(1000)
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: longId
        }

      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro ID Largo',
        description: 'Descripción'
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicromicroById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByIdQuery
      expect(executedQuery.payload.id).toBe(longId)

      expect(result).toEqual(expectedResponse)
    })

    it('should handle database timeout errors', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'timeout-id'
        }

      const timeoutError = new Error('Database timeout')
      queryBus.execute.mockRejectedValue(timeoutError)

      // Act & Assert
      await expect(
        controller.getMicromicroById(request)
      ).rejects.toThrow('Database timeout')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle entity with special characters in name and description', async () => {
      // Arrange
      const request: micromicro.GetMicromicroByIdDto =
        {
          id: 'special-chars-id'
        }

      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro @#$%^&*()',
        description: 'Descripción con ñáéíóú y emojis 🚀💻'
      })

      const expectedResponse: micromicro.Micromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicromicroById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.name).toBe('Micromicro @#$%^&*()')
      expect(result.description).toBe('Descripción con ñáéíóú y emojis 🚀💻')
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        GetMicromicroByIdGrpcController
      )
      expect(queryBus).toBeDefined()
      expect(mapper).toBeDefined()
    })

    it('should have QueryBus injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toBeDefined()
      expect(typeof queryBus.execute).toBe('function')
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
        request: micromicro.GetMicromicroByIdDto
      ) => {
        return controller.getMicromicroById(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getMicromicroById.name).toBe(
        'getMicromicroById'
      )
    })
  })
})
