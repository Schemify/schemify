import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { micromicro } from '@proto'

import { GetAllMicromicroGrpcController } from './get-all-micromicro.grpc.controller'
import { GetAllMicromicroQuery } from '@micromicro/microservice/application/ports/inbounds/queries'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('GetAllMicromicroGrpcController', () => {
  let controller: GetAllMicromicroGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<MicromicroMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllMicromicroGrpcController],
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

    controller = module.get<GetAllMicromicroGrpcController>(
      GetAllMicromicroGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(MicromicroMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllMicromicro', () => {
    it('should return all micromicro successfully', async () => {
      // Arrange
      const mockEntities = [
        MicromicroEntity.create({
          name: 'Micromicro 1',
          description: 'Descripción 1'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 2',
          description: 'Descripción 2'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 3'
        })
      ]

      const expectedProtoMicromicro = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: micromicro.Micromicro = {
        micromicro: expectedProtoMicromicro
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
      const result = await controller.getAllMicromicro()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(3)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetAllMicromicroQuery
      expect(executedQuery).toBeInstanceOf(GetAllMicromicroQuery)

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(3)
    })

    it('should return empty array when no micromicro exist', async () => {
      // Arrange
      const mockEntities: MicromicroEntity[] = []

      const expectedResponse: micromicro.Micromicro = {
        micromicro: []
      }

      queryBus.execute.mockResolvedValue(mockEntities)

      // Act
      const result = await controller.getAllMicromicro()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(0)
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const queryError = new Error('Database connection failed')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(controller.getAllMicromicro()).rejects.toThrow(
        'Database connection failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors during entity conversion', async () => {
      // Arrange
      const mockEntities = [
        MicromicroEntity.create({
          name: 'Micromicro 1',
          description: 'Descripción 1'
        })
      ]

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockEntities)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(controller.getAllMicromicro()).rejects.toThrow(
        'Entity to proto mapping failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntities[0])
    })

    it('should handle single micromicro with all fields', async () => {
      // Arrange
      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Único',
        description: 'Descripción completa'
      })

      const expectedProtoMicromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      const expectedResponse: micromicro.Micromicro = {
        micromicro: [expectedProtoMicromicro]
      }

      queryBus.execute.mockResolvedValue([mockEntity])
      mapper.entityToProto.mockReturnValue(expectedProtoMicromicro)

      // Act
      const result = await controller.getAllMicromicro()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(1)
    })

    it('should handle single micromicro without description', async () => {
      // Arrange
      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Sin Descripción'
      })

      const expectedProtoMicromicro = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      const expectedResponse: micromicro.Micromicro = {
        micromicro: [expectedProtoMicromicro]
      }

      queryBus.execute.mockResolvedValue([mockEntity])
      mapper.entityToProto.mockReturnValue(expectedProtoMicromicro)

      // Act
      const result = await controller.getAllMicromicro()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro[0].description).toBeUndefined()
    })

    it('should handle large number of micromicro', async () => {
      // Arrange
      const mockEntities = Array.from({ length: 100 }, (_, index) =>
        MicromicroEntity.create({
          name: `Micromicro ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const expectedProtoMicromicro = mockEntities.map(
        (entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        })
      )

      const expectedResponse: micromicro.Micromicro = {
        micromicro: expectedProtoMicromicro
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
      const result = await controller.getAllMicromicro()

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetAllMicromicroQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledTimes(100)

      expect(result).toEqual(expectedResponse)
      expect(result.micromicro).toHaveLength(100)
    })

    it('should return all micromicro when query succeeds', async () => {
      const expectedEntities = [
        MicromicroEntity.create({
          name: 'Micromicro 1'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 2'
        })
      ]

      queryBus.execute.mockResolvedValue(expectedEntities)

      const result = await controller.getAllMicromicro()

      expect(result).toEqual({
        micromicro: expectedEntities.map((entity) => ({
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value
        }))
      })
    })

    it('should return empty array when no micromicro exist', async () => {
      queryBus.execute.mockResolvedValue([])

      const result = await controller.getAllMicromicro()

      expect(result).toEqual({
        micromicro: []
      })
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        GetAllMicromicroGrpcController
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
      const method = () => {
        return controller.getAllMicromicro()
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getAllMicromicro.name).toBe(
        'getAllMicromicro'
      )
    })
  })
})
