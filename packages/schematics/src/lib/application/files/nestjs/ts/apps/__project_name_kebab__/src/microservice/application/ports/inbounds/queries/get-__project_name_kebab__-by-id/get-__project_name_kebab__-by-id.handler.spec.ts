/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Get__project_name_pascal__ByIdHandler } from './get-__project_name_camel__-by-id.handler'
import { Get__project_name_pascal__ByIdQuery } from './get-__project_name_camel__-by-id.query'
import { Get__project_name_pascal__ByIdPort } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-query-ports'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Get__project_name_pascal__ByIdHandler', () => {
  let handler: Get__project_name_pascal__ByIdHandler
  let queryRepository: jest.Mocked<Get__project_name_pascal__ByIdPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Get__project_name_pascal__ByIdHandler,
        {
          provide: Get__project_name_pascal__ByIdPort,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(Get__project_name_pascal__ByIdHandler)
    queryRepository = module.get(Get__project_name_pascal__ByIdPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return __project_name_camel__ when it exists', async () => {
      // Arrange
      const existing__project_name_pascal__ =
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ Existente',
          description: 'Descripción del __project_name_camel__'
        })

      // Override the id for consistent testing
      Object.defineProperty(existing__project_name_pascal__, 'id', {
        value: '__project_name_camel__-123'
      })

      queryRepository.getById.mockResolvedValue(existing__project_name_pascal__)

      const query = new Get__project_name_pascal__ByIdQuery({
        id: '__project_name_camel__-123'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(existing__project_name_pascal__)
      expect(result?.id).toBe('__project_name_camel__-123')
      expect(result?.props.name.value).toBe('__project_name_pascal__ Existente')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        '__project_name_camel__-123'
      )
    })

    it('should return null when __project_name_camel__ does not exist', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new Get__project_name_pascal__ByIdQuery({
        id: '__project_name_camel__-no-existe'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        '__project_name_camel__-no-existe'
      )
    })

    it('should return __project_name_camel__ without description when not provided', async () => {
      // Arrange
      const __project_name_camel__WithoutDesc =
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ Sin Descripción'
        })

      Object.defineProperty(__project_name_camel__WithoutDesc, 'id', {
        value: '__project_name_camel__-sin-desc'
      })

      queryRepository.getById.mockResolvedValue(
        __project_name_camel__WithoutDesc
      )

      const query = new Get__project_name_pascal__ByIdQuery({
        id: '__project_name_camel__-sin-desc'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(__project_name_camel__WithoutDesc)
      expect(result?.id).toBe('__project_name_camel__-sin-desc')
      expect(result?.props.name.value).toBe(
        '__project_name_pascal__ Sin Descripción'
      )
      expect(result?.props.description?.value).toBe('')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      queryRepository.getById.mockRejectedValue(repositoryError)

      const query = new Get__project_name_pascal__ByIdQuery({
        id: '__project_name_camel__-error'
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        '__project_name_camel__-error'
      )
    })

    it('should handle empty string id', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new Get__project_name_pascal__ByIdQuery({ id: '' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith('')
    })

    it('should preserve all __project_name_camel__ entity properties', async () => {
      // Arrange
      const __project_name_camel__WithAllProps =
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ Completo',
          description: 'Descripción completa del __project_name_camel__'
        })

      Object.defineProperty(__project_name_camel__WithAllProps, 'id', {
        value: '__project_name_camel__-completo-123'
      })

      queryRepository.getById.mockResolvedValue(
        __project_name_camel__WithAllProps
      )

      const query = new Get__project_name_pascal__ByIdQuery({
        id: '__project_name_camel__-completo-123'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(__project_name_camel__WithAllProps)
      expect(result?.id).toBe('__project_name_camel__-completo-123')
      expect(result?.props.name.value).toBe('__project_name_pascal__ Completo')
      expect(result?.props.description?.value).toBe(
        'Descripción completa del __project_name_camel__'
      )
      expect(result?.props.createdAt).toBeInstanceOf(Date)
      expect(result?.props.updatedAt).toBeInstanceOf(Date)
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should handle UUID format ids', async () => {
      // Arrange
      const uuid__project_name_pascal__ = __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ UUID',
        description: '__project_name_pascal__ con ID en formato UUID'
      })

      const uuidId = '550e8400-e29b-41d4-a716-446655440000'
      Object.defineProperty(uuid__project_name_pascal__, 'id', {
        value: uuidId
      })

      queryRepository.getById.mockResolvedValue(uuid__project_name_pascal__)

      const query = new Get__project_name_pascal__ByIdQuery({ id: uuidId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(uuid__project_name_pascal__)
      expect(result?.id).toBe(uuidId)
      expect(result?.props.name.value).toBe('__project_name_pascal__ UUID')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(uuidId)
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const specialId = '__project_name_camel__-123-@#$%^&*()'
      queryRepository.getById.mockResolvedValue(null)

      const query = new Get__project_name_pascal__ByIdQuery({ id: specialId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(specialId)
    })
  })
})
