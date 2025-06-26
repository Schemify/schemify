import { Test, TestingModule } from '@nestjs/testing'
import { QueryBus } from '@nestjs/cqrs'

import { __project_name_kebab__ } from '@proto'

import { Get__project_name_pascal__ByIdGrpcController } from './get-__project_name_kebab__-by-id.grpc.controller'
import { Get__project_name_pascal__ByIdQuery } from '@__project_name_kebab__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from '@__project_name_kebab__/microservice/infrastructure/mappers/__project_name_kebab__.mapper'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

describe('Get__project_name_pascal__ByIdGrpcController', () => {
  let controller: Get__project_name_pascal__ByIdGrpcController
  let queryBus: jest.Mocked<QueryBus>
  let mapper: jest.Mocked<__project_name_pascal__Mapper>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Get__project_name_pascal__ByIdGrpcController],
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

    controller = module.get<Get__project_name_pascal__ByIdGrpcController>(
      Get__project_name_pascal__ByIdGrpcController
    )
    queryBus = module.get(QueryBus)
    mapper = module.get(__project_name_pascal__Mapper)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get__project_name_pascal__ById', () => {
    it('should return cliente successfully with all fields', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'test-id-123'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Test',
        description: 'Descripción del cliente'
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.get__project_name_pascal__ById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByIdQuery
      expect(executedQuery.payload.id).toBe(request.id)

      expect(result).toEqual(expectedResponse)
    })

    it('should return cliente without description', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'test-id-456'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Sin Descripción'
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: undefined
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.get__project_name_pascal__ById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.description).toBeUndefined()
    })

    it('should handle query bus errors', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'non-existent-id'
      }

      const queryError = new Error('Client not found')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(controller.get__project_name_pascal__ById(request)).rejects.toThrow(
        'Client not found'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'test-id-789'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Mapper Error',
        description: 'Descripción'
      })

      const mapperError = new Error('Entity to proto mapping failed')
      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(controller.get__project_name_pascal__ById(request)).rejects.toThrow(
        'Entity to proto mapping failed'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)
    })

    it('should handle empty id', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: ''
      }

      const queryError = new Error('Invalid client ID')
      queryBus.execute.mockRejectedValue(queryError)

      // Act & Assert
      await expect(controller.get__project_name_pascal__ById(request)).rejects.toThrow(
        'Invalid client ID'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByIdQuery
      expect(executedQuery.payload.id).toBe('')
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'test-id-@#$%^&*()'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Cliente Especial',
        description: 'Descripción con caracteres especiales'
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.get__project_name_pascal__ById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByIdQuery
      expect(executedQuery.payload.id).toBe('test-id-@#$%^&*()')

      expect(result).toEqual(expectedResponse)
    })

    it('should handle very long id', async () => {
      // Arrange
      const longId = 'a'.repeat(1000)
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: longId
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Cliente ID Largo',
        description: 'Descripción'
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.get__project_name_pascal__ById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )

      const executedQuery = queryBus.execute.mock
        .calls[0][0] as Get__project_name_pascal__ByIdQuery
      expect(executedQuery.payload.id).toBe(longId)

      expect(result).toEqual(expectedResponse)
    })

    it('should handle database timeout errors', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'timeout-id'
      }

      const timeoutError = new Error('Database timeout')
      queryBus.execute.mockRejectedValue(timeoutError)

      // Act & Assert
      await expect(controller.get__project_name_pascal__ById(request)).rejects.toThrow(
        'Database timeout'
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).not.toHaveBeenCalled()
    })

    it('should handle entity with special characters in name and description', async () => {
      // Arrange
      const request: __project_name_kebab__.Get__project_name_pascal__ByIdDto = {
        id: 'special-chars-id'
      }

      const mockEntity = __project_name_pascal__Entity.create({
        name: 'Cliente @#$%^&*()',
        description: 'Descripción con ñáéíóú y emojis 🚀💻'
      })

      const expectedResponse: __project_name_kebab__.__project_name_pascal__ = {
        id: mockEntity.id,
        name: mockEntity.props.name.value,
        description: mockEntity.props.description?.value
      }

      queryBus.execute.mockResolvedValue(mockEntity)
      mapper.entityToProto.mockReturnValue(expectedResponse)

      // Act
      const result = await controller.get__project_name_pascal__ById(request)

      // Assert
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(Get__project_name_pascal__ByIdQuery)
      )
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mapper.entityToProto).toHaveBeenCalledWith(mockEntity)

      expect(result).toEqual(expectedResponse)
      expect(result.name).toBe('Cliente @#$%^&*()')
      expect(result.description).toBe('Descripción con ñáéíóú y emojis 🚀💻')
    })
  })

  describe('constructor and dependencies', () => {
    it('should be properly instantiated with dependencies', () => {
      // Assert
      expect(controller).toBeDefined()
      expect(controller).toBeInstanceOf(Get__project_name_pascal__ByIdGrpcController)
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
      const method = (request: __project_name_kebab__.Get__project_name_pascal__ByIdDto) => {
        return controller.get__project_name_pascal__ById(request)
      }

      // Assert
      expect(typeof method).toBe('function')
      expect(controller.get__project_name_pascal__ById.name).toBe('get__project_name_pascal__ById')
    })
  })
})
