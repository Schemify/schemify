import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { __project_name_snake__ } from '@proto'

import { GetAll__project_name_camel__GrpcController } from './get-all__project_name_kebab__.grpc.controller'
import { GetAll__project_name_pascal__Query } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'
import { __project_name_camel__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

describe('GetAll__project_name_camel__GrpcController', () => {
  let controller: GetAll__project_name_camel__GrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<__project_name_pascal__Mapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAll__project_name_camel__GrpcController],
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

    controller = module.get<GetAll__project_name_camel__GrpcController>(
      GetAll__project_name_camel__GrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(__project_name_pascal__Mapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll__project_name_camel__', () => {
    it('should return all __project_name_camel__ successfully', async () => {
      // Arrange
      const mockEntities = [
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 1',
          description: 'Descripción 1'
        }),
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 2',
          description: 'Descripción 2'
        }),
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 3'
        })
      ]

      const expectedProto__project_name_camel__ = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        __project_name_camel__: expectedProto__project_name_camel__
      }

      queryBus.execute.mockResolvedValue(mockEntities)
      mockEntities.forEach((entity) => {
        mapper.entityToProto.mockReturnValueOnce({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      })

      // Act
      const result = await controller.getAll__project_name_camel__()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(3)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetAll__project_name_pascal__Query
      expect(executedQuery).toBeInstanceOf(GetAll__project_name_pascal__Query)

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(3)
    })

    it('should return empty array when no __project_name_camel__ exist', async () => {
      // Arrange
      const mockEntities: __project_name_camel__Entity[] = []

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        __project_name_camel__: []
      }

      queryBus.execute.mockResolvedValue(mockEntities)

      // Act
      const result = await controller.getAll__project_name_camel__()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(0)
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const queryError = new Error('Database connection failed')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(controller.getAll__project_name_camel__()).rejects.toThrow(
        'Database connection failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entity conversion', async () => {
      // Arrange
      const mockEntities = [
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 1',
          description: 'Descripción 1'
        })
      ]

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockEntities)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(controller.getAll__project_name_camel__()).rejects.toThrow(
        'Entity to proto mapping failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])
    })

    it('should handle single __project_name_camel__ with all fields', async () => {
      // Arrange
      const mockEntity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Único',
        description: 'Descripción completa'
      })

      const expectedProto__project_name_camel__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        __project_name_camel__: [expectedProto__project_name_camel__]
      }

      queryBus.execute.mockResolvedValue([mockEntity])
      mapper.entityToProto.mockReturnValue(expectedProto__project_name_camel__)

      // Act
      const result = await controller.getAll__project_name_camel__()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(1)
    })

    it('should handle single __project_name_camel__ without description', async () => {
      // Arrange
      const mockEntity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Sin Descripción'
      })

      const expectedProto__project_name_camel__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        __project_name_camel__: [expectedProto__project_name_camel__]
      }

      queryBus.execute.mockResolvedValue([mockEntity])
      mapper.entityToProto.mockReturnValue(expectedProto__project_name_camel__)

      // Act
      const result = await controller.getAll__project_name_camel__()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__[0].description).toBeUndefined()
    })

    it('should handle large number of __project_name_camel__', async () => {
      // Arrange
      const mockEntities = Array.from({ length: 100 }, (_, index) =>
        __project_name_camel__Entity.create({
          name: `__project_name_camel__ ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const expectedProto__project_name_camel__ = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: __project_name_camel__.__project_name_camel__ = {
        __project_name_camel__: expectedProto__project_name_camel__
      }

      queryBus.execute.mockResolvedValue(mockEntities)
      mockEntities.forEach((entity) => {
        mapper.entityToProto.mockReturnValueOnce({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      })

      // Act
      const result = await controller.getAll__project_name_camel__()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAll__project_name_pascal__Query)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(100)

      expect(result).toEqual(expectedResponse)
      expect(result.__project_name_camel__).toHaveLength(100)
    })

    it('should return all __project_name_camel__ when query succeeds', async () => {
      const expectedEntities = [
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 1'
        }),
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 2'
        })
      ]

      queryBus.execute.mockResolvedValue(expectedEntities)

      const result = await controller.getAll__project_name_camel__()

      expect(result).toEqual({
        __project_name_camel__: expectedEntities.map((entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        }))
      })
    })

    it('should return empty array when no __project_name_camel__ exist', async () => {
      queryBus.execute.mockResolvedValue([])

      const result = await controller.getAll__project_name_camel__()

      expect(result).toEqual({
        __project_name_camel__: []
      })
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        GetAll__project_name_camel__GrpcController
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
      const method = () => {
        return controller.getAll__project_name_camel__()
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getAll__project_name_camel__.name).toBe(
        'getAll__project_name_camel__'
      )
    })
  })
})
