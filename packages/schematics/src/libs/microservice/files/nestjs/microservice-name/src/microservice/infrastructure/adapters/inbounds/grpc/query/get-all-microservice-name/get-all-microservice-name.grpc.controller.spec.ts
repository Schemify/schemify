import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { microserviceName } from '@proto'

import { GetAllMicroserviceNameGrpcController } from './get-all-microserviceName.grpc.controller'
import { GetAllMicroserviceNameQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetAllMicroserviceNameGrpcController', () => {
  let controller: GetAllMicroserviceNameGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<MicroserviceNameMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllMicroserviceNameGrpcController],
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

    controller = module.get<GetAllMicroserviceNameGrpcController>(
      GetAllMicroserviceNameGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(MicroserviceNameMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllMicroserviceName', () => {
    it('should return all microserviceName successfully', async () => {
      // Arrange
      const mockEntities = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 1',
          description: 'Descripción 1'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 2',
          description: 'Descripción 2'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 3'
        })
      ]

      const expectedProtoMicroserviceName = mockEntities.map((entity) => ({
        id: entity.id,
        name: entity.props.name.value,
        description: entity.props.description?.value
      }))

      const expectedResponse: microserviceName.MicroserviceName = {
        microserviceName: expectedProtoMicroserviceName
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
      const result = await controller.getAllMicroserviceName()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(3)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetAllMicroserviceNameQuery
      expect(executedQuery).toBeInstanceOf(GetAllMicroserviceNameQuery)

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(3)
    })

    it('should return empty array when no microserviceName exist', async () => {
      // Arrange
      const mockEntities: MicroserviceNameEntity[] = []

      const expectedResponse: microserviceName.MicroserviceName = {
        microserviceName: []
      }

      queryBus.execute.mockResolvedValue(mockEntities)

      // Act
      const result = await controller.getAllMicroserviceName()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(0)
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const queryError = new Error('Database connection failed')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(controller.getAllMicroserviceName()).rejects.toThrow(
        'Database connection failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entity conversion', async () => {
      // Arrange
      const mockEntities = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 1',
          description: 'Descripción 1'
        })
      ]

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockEntities)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(controller.getAllMicroserviceName()).rejects.toThrow(
        'Entity to proto mapping failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])
    })

    it('should handle single microserviceName with all fields', async () => {
      // Arrange
      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Único',
        description: 'Descripción completa'
      })

      const expectedProtoMicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      const expectedResponse: microserviceName.MicroserviceName = {
        microserviceName: [expectedProtoMicroserviceName]
      }

      queryBus.execute.mockResolvedValue([mockEntity])
      mapper.entityToProto.mockReturnValue(expectedProtoMicroserviceName)

      // Act
      const result = await controller.getAllMicroserviceName()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(1)
    })

    it('should handle single microserviceName without description', async () => {
      // Arrange
      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Sin Descripción'
      })

      const expectedProtoMicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      const expectedResponse: microserviceName.MicroserviceName = {
        microserviceName: [expectedProtoMicroserviceName]
      }

      queryBus.execute.mockResolvedValue([mockEntity])
      mapper.entityToProto.mockReturnValue(expectedProtoMicroserviceName)

      // Act
      const result = await controller.getAllMicroserviceName()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName[0].description).toBeUndefined()
    })

    it('should handle large number of microserviceName', async () => {
      // Arrange
      const mockEntities = Array.from({ length: 100 }, (_, index) =>
        MicroserviceNameEntity.create({
          name: `MicroserviceName ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const expectedProtoMicroserviceName = mockEntities.map((entity) => ({
        id: entity.id,
        name: entity.props.name.value,
        description: entity.props.description?.value
      }))

      const expectedResponse: microserviceName.MicroserviceName = {
        microserviceName: expectedProtoMicroserviceName
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
      const result = await controller.getAllMicroserviceName()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicroserviceNameQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(100)

      expect(result).toEqual(expectedResponse)
      expect(result.microserviceName).toHaveLength(100)
    })

    it('should return all microserviceName when query succeeds', async () => {
      const expectedEntities = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 1'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 2'
        })
      ]

      queryBus.execute.mockResolvedValue(expectedEntities)

      const result = await controller.getAllMicroserviceName()

      expect(result).toEqual({
        microserviceName: expectedEntities.map((entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        }))
      })
    })

    it('should return empty array when no microserviceName exist', async () => {
      queryBus.execute.mockResolvedValue([])

      const result = await controller.getAllMicroserviceName()

      expect(result).toEqual({
        microserviceName: []
      })
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(GetAllMicroserviceNameGrpcController)
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
      const method = () => {
        return controller.getAllMicroserviceName()
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getAllMicroserviceName.name).toBe(
        'getAllMicroserviceName'
      )
    })
  })
})
