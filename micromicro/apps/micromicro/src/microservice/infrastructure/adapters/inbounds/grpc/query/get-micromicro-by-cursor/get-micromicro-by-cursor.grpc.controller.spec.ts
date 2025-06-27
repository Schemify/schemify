import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { micromicro } from '@proto'

import { GetMicromicroByCursorGrpcController } from './get-micromicro-by-cursor.grpc.controller'
import { GetMicromicroByCursorQuery } from '@micromicro/microservice/application/ports/inbounds/queries'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'
import { CursorResult } from '@micromicro/libs/shared/interfaces/pagination/cursor-result.interface'

describe('GetMicromicroByCursorGrpcController', () => {
  let controller: GetMicromicroByCursorGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<MicromicroMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMicromicroByCursorGrpcController],
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

    controller = module.get<GetMicromicroByCursorGrpcController>(
      GetMicromicroByCursorGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(MicromicroMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getMicromicroByCursor', () => {
    it('should return paginated micromicro with next cursor', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'micromicro-123',
        limit: 10
      }

      const mockEntities = [
        MicromicroEntity.create({
          name: 'Micromicro 1',
          description: 'Descripción 1'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 2',
          description: 'Descripción 2'
        })
      ]

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: mockEntities,
        nextCursor: 'micromicro-456',
        hasMore: true
      }

      const expectedProtoMicromicro = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: micromicro.CursorPaginatedMicromicro =
        {
          micromicro: expectedProtoMicromicro,
          nextCursor: 'micromicro-456',
          hasMore: true
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mockEntities.forEach((entity) => {
        mapper.entityToProto.mockReturnValueOnce({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      })

      // Act
      const result =
        await controller.getMicromicroByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(2)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByCursorQuery
      expect(executedQuery.payload.afterId).toBe(request.afterId)
      expect(executedQuery.payload.limit).toBe(request.limit)

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(2)
      expect(result.nextCursor).toBe('micromicro-456')
      expect(result.hasMore).toBe(true)
    })

    it('should return paginated micromicro without next cursor', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'micromicro-789',
        limit: 5
      }

      const mockEntities = [
        MicromicroEntity.create({
          name: 'Micromicro Final',
          description: 'Último micromicro'
        })
      ]

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: mockEntities,
        nextCursor: null,
        hasMore: false
      }

      const expectedProtoMicromicro = {
        id: mockEntities[0].id,
        name: mockEntities[0].props.name.value,
        description: mockEntities[0].props.description?.value
      }

      const expectedResponse: micromicro.CursorPaginatedMicromicro =
        {
          micromicro: [expectedProtoMicromicro],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockReturnValue(expectedProtoMicromicro)

      // Act
      const result =
        await controller.getMicromicroByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(1)
      expect(result.nextCursor).toBe('')
      expect(result.hasMore).toBe(false)
    })

    it('should handle empty results', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'non-existent',
        limit: 10
      }

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      const expectedResponse: micromicro.CursorPaginatedMicromicro =
        {
          micromicro: [],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)

      // Act
      const result =
        await controller.getMicromicroByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(0)
      expect(result.nextCursor).toBe('')
      expect(result.hasMore).toBe(false)
    })

    it('should handle request without afterId', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: '',
        limit: 10
      }

      const mockEntities = [
        MicromicroEntity.create({
          name: 'Primer Micromicro',
          description: 'Descripción'
        })
      ]

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: mockEntities,
        nextCursor: 'first-cursor',
        hasMore: true
      }

      const expectedProtoMicromicro = {
        id: mockEntities[0].id,
        name: mockEntities[0].props.name.value,
        description: mockEntities[0].props.description?.value
      }

      const expectedResponse: micromicro.CursorPaginatedMicromicro =
        {
          micromicro: [expectedProtoMicromicro],
          nextCursor: 'first-cursor',
          hasMore: true
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockReturnValue(expectedProtoMicromicro)

      // Act
      const result =
        await controller.getMicromicroByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByCursorQuery
      expect(executedQuery.payload.afterId).toBe('')
      expect(executedQuery.payload.limit).toBe(10)

      expect(result).toEqual(expectedResponse)
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'micromicro-123',
        limit: 10
      }

      const queryError = new Error('Database connection failed')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.getMicromicroByCursor(request)
      ).rejects.toThrow('Database connection failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entity conversion', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'micromicro-123',
        limit: 10
      }

      const mockEntities = [
        MicromicroEntity.create({
          name: 'Micromicro Error',
          description: 'Descripción'
        })
      ]

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: mockEntities,
        nextCursor: 'next-cursor',
        hasMore: true
      }

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.getMicromicroByCursor(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])
    })

    it('should handle large limit values', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'micromicro-123',
        limit: 1000
      }

      const mockEntities = Array.from({ length: 100 }, (_, index) =>
        MicromicroEntity.create({
          name: `Micromicro ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: mockEntities,
        nextCursor: 'large-cursor',
        hasMore: true
      }

      const expectedProtoMicromicro = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: micromicro.CursorPaginatedMicromicro =
        {
          micromicro: expectedProtoMicromicro,
          nextCursor: 'large-cursor',
          hasMore: true
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mockEntities.forEach((entity) => {
        mapper.entityToProto.mockReturnValueOnce({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      })

      // Act
      const result =
        await controller.getMicromicroByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(100)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByCursorQuery
      expect(executedQuery.payload.limit).toBe(1000)

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(100)
    })

    it('should handle zero limit', async () => {
      // Arrange
      const request: micromicro.CursorPaginationRequest = {
        afterId: 'micromicro-123',
        limit: 0
      }

      const mockCursorResult: CursorResult<MicromicroEntity> = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      const expectedResponse: micromicro.CursorPaginatedMicromicro =
        {
          micromicro: [],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)

      // Act
      const result =
        await controller.getMicromicroByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicromicroByCursorQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicromicroByCursorQuery
      expect(executedQuery.payload.limit).toBe(0)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        GetMicromicroByCursorGrpcController
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
        request: micromicro.CursorPaginationRequest
      ) => {
        return controller.getMicromicroByCursor(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getMicromicroByCursor.name).toBe(
        'getMicromicroByCursor'
      )
    })
  })
})
