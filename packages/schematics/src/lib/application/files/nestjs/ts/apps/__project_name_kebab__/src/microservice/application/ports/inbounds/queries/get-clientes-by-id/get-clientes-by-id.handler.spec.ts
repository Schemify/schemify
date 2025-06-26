/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Get__project_name_pascal__ByIdHandler } from './get-__project_name_kebab__-by-id.handler'
import { Get__project_name_pascal__ByIdQuery } from './get-__project_name_kebab__-by-id.query'
import { Get__project_name_pascal__ByIdPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

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
    it('should return client when it exists', async () => {
      // Arrange
      const existingClient = __project_name_pascal__Entity.create({
        name: 'Cliente Existente',
        description: 'Descripción del cliente'
      })

      // Override the id for consistent testing
      Object.defineProperty(existingClient, 'id', { value: 'cliente-123' })

      queryRepository.getById.mockResolvedValue(existingClient)

      const query = new Get__project_name_pascal__ByIdQuery({ id: 'cliente-123' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(existingClient)
      expect(result?.id).toBe('cliente-123')
      expect(result?.props.name.value).toBe('Cliente Existente')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith('cliente-123')
    })

    it('should return null when client does not exist', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new Get__project_name_pascal__ByIdQuery({ id: 'cliente-no-existe' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith('cliente-no-existe')
    })

    it('should return client without description when not provided', async () => {
      // Arrange
      const clientWithoutDesc = __project_name_pascal__Entity.create({
        name: 'Cliente Sin Descripción'
      })

      Object.defineProperty(clientWithoutDesc, 'id', {
        value: 'cliente-sin-desc'
      })

      queryRepository.getById.mockResolvedValue(clientWithoutDesc)

      const query = new Get__project_name_pascal__ByIdQuery({ id: 'cliente-sin-desc' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(clientWithoutDesc)
      expect(result?.id).toBe('cliente-sin-desc')
      expect(result?.props.name.value).toBe('Cliente Sin Descripción')
      expect(result?.props.description?.value).toBe('')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      queryRepository.getById.mockRejectedValue(repositoryError)

      const query = new Get__project_name_pascal__ByIdQuery({ id: 'cliente-error' })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith('cliente-error')
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

    it('should preserve all client entity properties', async () => {
      // Arrange
      const clientWithAllProps = __project_name_pascal__Entity.create({
        name: 'Cliente Completo',
        description: 'Descripción completa del cliente'
      })

      Object.defineProperty(clientWithAllProps, 'id', {
        value: 'cliente-completo-123'
      })

      queryRepository.getById.mockResolvedValue(clientWithAllProps)

      const query = new Get__project_name_pascal__ByIdQuery({ id: 'cliente-completo-123' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(clientWithAllProps)
      expect(result?.id).toBe('cliente-completo-123')
      expect(result?.props.name.value).toBe('Cliente Completo')
      expect(result?.props.description?.value).toBe(
        'Descripción completa del cliente'
      )
      expect(result?.props.createdAt).toBeInstanceOf(Date)
      expect(result?.props.updatedAt).toBeInstanceOf(Date)
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should handle UUID format ids', async () => {
      // Arrange
      const uuidClient = __project_name_pascal__Entity.create({
        name: 'Cliente UUID',
        description: 'Cliente con ID en formato UUID'
      })

      const uuidId = '550e8400-e29b-41d4-a716-446655440000'
      Object.defineProperty(uuidClient, 'id', { value: uuidId })

      queryRepository.getById.mockResolvedValue(uuidClient)

      const query = new Get__project_name_pascal__ByIdQuery({ id: uuidId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(uuidClient)
      expect(result?.id).toBe(uuidId)
      expect(result?.props.name.value).toBe('Cliente UUID')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(uuidId)
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const specialId = 'cliente-123-@#$%^&*()'
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
