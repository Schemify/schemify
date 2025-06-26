import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { __project_name_camel__ } from '@proto'

import { Get__project_name_pascal__ByCursorGrpcController } from './get-__project_name_camel__-by-cursor.grpc.controller'
import { Get__project_name_pascal__ByCursorQuery } from '@__project_name_camel__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'
import { CursorResult } from '@__project_name_camel__/libs/shared/interfaces/pagination/cursor-result.interface'

describe('Get__project_name_pascal__ByCursorGrpcController', () => {
  let controller: Get__project_name_pascal__ByCursorGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<__project_name_pascal__Mapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Get__project_name_pascal__ByCursorGrpcController],
      providers: [
        {
          provide: QueryBus,
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

    controller = module.get<Get__project_name_pascal__ByCursorGrpcController>(
      Get__project_name_pascal__ByCursorGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(__project_name_pascal__Mapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get__project_name_pascal__ByCursor', () => {
    it('should return paginated __project_name_camel__ with next cursor', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '__project_name_camel__-123',
        limit: 10
      }

      const mockEntities = [
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ 1',
          description: 'Descripción 1'
        }),
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ 2',
          description: 'Descripción 2'
        })
      ]

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
        items: mockEntities,
        nextCursor: '__project_name_camel__-456',
        hasMore: true
      }

      const expectedProto__project_name_pascal__ = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: __project_name_camel__.CursorPaginated__project_name_pascal__ =
        {
          __project_name_camel__: expectedProto__project_name_pascal__,
          nextCursor: '__project_name_camel__-456',
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
        await controller.get__project_name_pascal__ByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(2)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByCursorQuery
      expect(executedQuery.payload.afterId).toBe(request.afterId)
      expect(executedQuery.payload.limit).toBe(request.limit)

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(2)
      expect(result.nextCursor).toBe('__project_name_camel__-456')
      expect(result.hasMore).toBe(true)
    })

    it('should return paginated __project_name_camel__ without next cursor', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '__project_name_camel__-789',
        limit: 5
      }

      const mockEntities = [
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ Final',
          description: 'Último __project_name_camel__'
        })
      ]

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
        items: mockEntities,
        nextCursor: null,
        hasMore: false
      }

      const expectedProto__project_name_pascal__ = {
        id: mockEntities[0].id,
        name: mockEntities[0].props.name.value,
        description: mockEntities[0].props.description?.value
      }

      const expectedResponse: __project_name_camel__.CursorPaginated__project_name_pascal__ =
        {
          __project_name_camel__: [expectedProto__project_name_pascal__],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockReturnValue(expectedProto__project_name_pascal__)

      // Act
      const result =
        await controller.get__project_name_pascal__ByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(1)
      expect(result.nextCursor).toBe('')
      expect(result.hasMore).toBe(false)
    })

    it('should handle empty results', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: 'non-existent',
        limit: 10
      }

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      const expectedResponse: __project_name_camel__.CursorPaginated__project_name_pascal__ =
        {
          __project_name_camel__: [],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)

      // Act
      const result =
        await controller.get__project_name_pascal__ByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(0)
      expect(result.nextCursor).toBe('')
      expect(result.hasMore).toBe(false)
    })

    it('should handle request without afterId', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '',
        limit: 10
      }

      const mockEntities = [
        __project_name_pascal__Entity.create({
          name: 'Primer __project_name_pascal__',
          description: 'Descripción'
        })
      ]

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
        items: mockEntities,
        nextCursor: 'first-cursor',
        hasMore: true
      }

      const expectedProto__project_name_pascal__ = {
        id: mockEntities[0].id,
        name: mockEntities[0].props.name.value,
        description: mockEntities[0].props.description?.value
      }

      const expectedResponse: __project_name_camel__.CursorPaginated__project_name_pascal__ =
        {
          __project_name_camel__: [expectedProto__project_name_pascal__],
          nextCursor: 'first-cursor',
          hasMore: true
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockReturnValue(expectedProto__project_name_pascal__)

      // Act
      const result =
        await controller.get__project_name_pascal__ByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByCursorQuery
      expect(executedQuery.payload.afterId).toBe('')
      expect(executedQuery.payload.limit).toBe(10)

      expect(result).toEqual(expectedResponse)
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '__project_name_camel__-123',
        limit: 10
      }

      const queryError = new Error('Database connection failed')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.get__project_name_pascal__ByCursor(request)
      ).rejects.toThrow('Database connection failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entity conversion', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '__project_name_camel__-123',
        limit: 10
      }

      const mockEntities = [
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ Error',
          description: 'Descripción'
        })
      ]

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
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
        controller.get__project_name_pascal__ByCursor(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])
    })

    it('should handle large limit values', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '__project_name_camel__-123',
        limit: 1000
      }

      const mockEntities = Array.from({ length: 100 }, (_, index) =>
        __project_name_pascal__Entity.create({
          name: `__project_name_pascal__ ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
        items: mockEntities,
        nextCursor: 'large-cursor',
        hasMore: true
      }

      const expectedProto__project_name_pascal__ = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: __project_name_camel__.CursorPaginated__project_name_pascal__ =
        {
          __project_name_camel__: expectedProto__project_name_pascal__,
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
        await controller.get__project_name_pascal__ByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(100)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByCursorQuery
      expect(executedQuery.payload.limit).toBe(1000)

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(100)
    })

    it('should handle zero limit', async () => {
      // Arrange
      const request: __project_name_camel__.CursorPaginationRequest = {
        afterId: '__project_name_camel__-123',
        limit: 0
      }

      const mockCursorResult: CursorResult<__project_name_pascal__Entity> = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      const expectedResponse: __project_name_camel__.CursorPaginated__project_name_pascal__ =
        {
          __project_name_camel__: [],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)

      // Act
      const result =
        await controller.get__project_name_pascal__ByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByCursorQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByCursorQuery
      expect(executedQuery.payload.limit).toBe(0)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        Get__project_name_pascal__ByCursorGrpcController
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

    it('should have __project_name_pascal__Mapper injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (
        request: __project_name_camel__.CursorPaginationRequest
      ) => {
        return controller.get__project_name_pascal__ByCursor(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.get__project_name_pascal__ByCursor.name).toBe(
        'get__project_name_pascal__ByCursor'
      )
    })
  })
})
