import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { microserviceName } from '@proto'

import { GetMicroserviceNameByIdGrpcController } from './get-microserviceName-by-id.grpc.controller'
import { GetMicroserviceNameByIdQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetMicroserviceNameByIdGrpcController', () => {
  let controller: GetMicroserviceNameByIdGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<MicroserviceNameMapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMicroserviceNameByIdGrpcController],
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

    controller = module.get<GetMicroserviceNameByIdGrpcController>(
      GetMicroserviceNameByIdGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(MicroserviceNameMapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getMicroserviceNameById', () => {
    it('should return microserviceName successfully with all fields', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id-123'
        }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Test',
        description: 'Descripción del microserviceName'
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicroserviceNameById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByIdQuery
      expect(executedQuery.payload.id).toBe(request.id)

      expect(result).toEqual(expectedResponse)
    })

    it('should return microserviceName without description', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id-456'
        }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Sin Descripción'
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicroserviceNameById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.description).toBeUndefined()
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'non-existent-id'
        }

      const queryError = new Error('MicroserviceName not found')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.getMicroserviceNameById(request)
      ).rejects.toThrow('MicroserviceName not found')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id-789'
        }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Mapper Error',
        description: 'Descripción'
      })

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(
        controller.getMicroserviceNameById(request)
      ).rejects.toThrow('Entity to proto mapping failed')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty id', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: ''
        }

      const queryError = new Error('Invalid microserviceName ID')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(
        controller.getMicroserviceNameById(request)
      ).rejects.toThrow('Invalid microserviceName ID')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByIdQuery
      expect(executedQuery.payload.id).toBe('')
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'test-id-@#$%^&*()'
        }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Especial',
        description: 'Descripción con caracteres especiales'
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicroserviceNameById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByIdQuery
      expect(executedQuery.payload.id).toBe('test-id-@#$%^&*()')

      expect(result).toEqual(expectedResponse)
    })

    it('should handle very long id', async () => {
      // Arrange
      const longId = 'a'.repeat(1000)
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: longId
        }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName ID Largo',
        description: 'Descripción'
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicroserviceNameById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as GetMicroserviceNameByIdQuery
      expect(executedQuery.payload.id).toBe(longId)

      expect(result).toEqual(expectedResponse)
    })

    it('should handle database timeout errors', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'timeout-id'
        }

      const timeoutError = new Error('Database timeout')
      queryBus.execute.mockRejectedValue(timeoutError)

      // Act & Assert
      await expect(
        controller.getMicroserviceNameById(request)
      ).rejects.toThrow('Database timeout')

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle entity with special characters in name and description', async () => {
      // Arrange
      const request: microserviceName.GetMicroserviceNameByIdDto =
        {
          id: 'special-chars-id'
        }

      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName @#$%^&*()',
        description: 'Descripción con ñáéíóú y emojis 🚀💻'
      })

      const expectedResponse: microserviceName.MicroserviceName = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.getMicroserviceNameById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetMicroserviceNameByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.name).toBe('MicroserviceName @#$%^&*()')
      expect(result.description).toBe('Descripción con ñáéíóú y emojis 🚀💻')
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(
        GetMicroserviceNameByIdGrpcController
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
      const method = (
        request: microserviceName.GetMicroserviceNameByIdDto
      ) => {
        return controller.getMicroserviceNameById(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.getMicroserviceNameById.name).toBe(
        'getMicroserviceNameById'
      )
    })
  })
})
