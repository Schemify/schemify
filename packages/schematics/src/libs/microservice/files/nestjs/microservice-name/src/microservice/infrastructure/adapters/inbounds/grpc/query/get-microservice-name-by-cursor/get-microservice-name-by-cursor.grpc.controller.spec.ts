import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { microserviceName } from '@proto'

import { GetMicroserviceNameByCursorGrpcController } from './get-microserviceName-by-cursor.grpc.controller'
import { GetMicroserviceNameByCursorQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'
import { CursorResult } from '@microserviceName/libs/shared/interfaces/pagination/cursor-result.interface'

describe('GetMicroserviceNameByCursorGrpcController', () => {
  let controller: GetMicroserviceNameByCursorGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<MicroserviceNameMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMicroserviceNameByCursorGrpcController],
      providers: [
        {
          provide: QueryBus,
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

    controller = module.get<GetMicroserviceNameByCursorGrpcController>(
      GetMicroserviceNameByCursorGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(MicroserviceNameMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getMicroserviceNameByCursor', () => {
    it('should return paginated microserviceName with next cursor', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'microserviceName-123',
        limit: 10
      }

      const mockEntities = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 1',
          description: 'Descripción 1'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 2',
          description: 'Descripción 2'
        })
      ]

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
        items: mockEntities,
        nextCursor: 'microserviceName-456',
        hasMore: true
      }

      const expectedProtoMicroserviceName = mockEntities.map((entity) => ({
        id: entity.id,
        name: entity.props.name.value,
        description: entity.props.description?.value
      }))

      const expectedResponse: microserviceName.CursorPaginatedMicroserviceName =
        {
          microserviceName: expectedProtoMicroserviceName,
          nextCursor: 'microserviceName-456',
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
      const result = await controller.getMicroserviceNameByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(2)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByCursorQuery
      expect(executedQuery.payload.afterId).toBe(request.afterId)
      expect(executedQuery.payload.limit).toBe(request.limit)

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(2)
      expect(result.nextCursor).toBe('microserviceName-456')
      expect(result.hasMore).toBe(true)
    })

    it('should return paginated microserviceName without next cursor', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'microserviceName-789',
        limit: 5
      }

      const mockEntities = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Final',
          description: 'Último microserviceName'
        })
      ]

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
        items: mockEntities,
        nextCursor: null,
        hasMore: false
      }

      const expectedProtoMicroserviceName = {
        id: mockEntities[0].id,
        name: mockEntities[0].props.name.value,
        description: mockEntities[0].props.description?.value
      }

      const expectedResponse: microserviceName.CursorPaginatedMicroserviceName =
        {
          microserviceName: [expectedProtoMicroserviceName],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockReturnValue(expectedProtoMicroserviceName)

      // Act
      const result = await controller.getMicroserviceNameByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(1)
      expect(result.nextCursor).toBe('')
      expect(result.hasMore).toBe(false)
    })

    it('should handle empty results', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'non-existent',
        limit: 10
      }

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      const expectedResponse: microserviceName.CursorPaginatedMicroserviceName =
        {
          microserviceName: [],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)

      // Act
      const result = await controller.getMicroserviceNameByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(0)
      expect(result.nextCursor).toBe('')
      expect(result.hasMore).toBe(false)
    })

    it('should handle request without afterId', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: '',
        limit: 10
      }

      const mockEntities = [
        MicroserviceNameEntity.create({
          name: 'Primer MicroserviceName',
          description: 'Descripción'
        })
      ]

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
        items: mockEntities,
        nextCursor: 'first-cursor',
        hasMore: true
      }

      const expectedProtoMicroserviceName = {
        id: mockEntities[0].id,
        name: mockEntities[0].props.name.value,
        description: mockEntities[0].props.description?.value
      }

      const expectedResponse: microserviceName.CursorPaginatedMicroserviceName =
        {
          microserviceName: [expectedProtoMicroserviceName],
          nextCursor: 'first-cursor',
          hasMore: true
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)
      mapper.entityToProto.mockReturnValue(expectedProtoMicroserviceName)

      // Act
      const result = await controller.getMicroserviceNameByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByCursorQuery
      expect(executedQuery.payload.afterId).toBe('')
      expect(executedQuery.payload.limit).toBe(10)

      expect(result).toEqual(expectedResponse)
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'microserviceName-123',
        limit: 10
      }

      const queryError = new Error('Database connection failed')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.getMicroserviceNameByCursor(request)
      ).rejects.toThrow('Database connection failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entity conversion', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'microserviceName-123',
        limit: 10
      }

      const mockEntities = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Error',
          description: 'Descripción'
        })
      ]

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
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
        controller.getMicroserviceNameByCursor(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])
    })

    it('should handle large limit values', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'microserviceName-123',
        limit: 1000
      }

      const mockEntities = Array.from({ length: 100 }, (_, index) =>
        MicroserviceNameEntity.create({
          name: `MicroserviceName ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
        items: mockEntities,
        nextCursor: 'large-cursor',
        hasMore: true
      }

      const expectedProtoMicroserviceName = mockEntities.map((entity) => ({
        id: entity.id,
        name: entity.props.name.value,
        description: entity.props.description?.value
      }))

      const expectedResponse: microserviceName.CursorPaginatedMicroserviceName =
        {
          microserviceName: expectedProtoMicroserviceName,
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
      const result = await controller.getMicroserviceNameByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(100)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByCursorQuery
      expect(executedQuery.payload.limit).toBe(1000)

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(100)
    })

    it('should handle zero limit', async () => {
      // Arrange
      const request: microserviceName.CursorPaginationRequest = {
        afterId: 'microserviceName-123',
        limit: 0
      }

      const mockCursorResult: CursorResult<MicroserviceNameEntity> = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      const expectedResponse: microserviceName.CursorPaginatedMicroserviceName =
        {
          microserviceName: [],
          nextCursor: '',
          hasMore: false
        }

      queryBus.execute.mockResolvedValue(mockCursorResult)

      // Act
      const result = await controller.getMicroserviceNameByCursor(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByCursorQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByCursorQuery
      expect(executedQuery.payload.limit).toBe(0)

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        GetMicroserviceNameByCursorGrpcController
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

    it('should have MicroserviceNameMapper injected', () => {
      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toBeDefined()
      expect(typeof mapper.entityToProto).toBe('function')
    })

    it('should have correct method signature', () => {
      // Arrange
      const method = (request: microserviceName.CursorPaginationRequest) => {
        return controller.getMicroserviceNameByCursor(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getMicroserviceNameByCursor.name).toBe(
        'getMicroserviceNameByCursor'
      )
    })
  })
})
