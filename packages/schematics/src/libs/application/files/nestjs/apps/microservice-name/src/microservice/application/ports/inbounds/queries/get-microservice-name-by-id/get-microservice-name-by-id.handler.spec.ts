/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetMicroserviceNameByIdHandler } from './getmicroservice-name-by-id.handler'
import { GetMicroserviceNameByIdQuery } from './getmicroservice-name-by-id.query'
import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-query-ports'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetMicroserviceNameByIdHandler', () => {
  let handler: GetMicroserviceNameByIdHandler
  let queryRepository: jest.Mocked<GetMicroserviceNameByIdPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMicroserviceNameByIdHandler,
        {
          provide: GetMicroserviceNameByIdPort,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetMicroserviceNameByIdHandler)
    queryRepository = module.get(GetMicroserviceNameByIdPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return microserviceName when it exists', async () => {
      // Arrange
      const existingMicroserviceName =
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Existente',
          description: 'Descripción del microserviceName'
        })

      // Override the id for consistent testing
      Object.defineProperty(existingMicroserviceName, 'id', {
        value: 'microserviceName-123'
      })

      queryRepository.getById.mockResolvedValue(existingMicroserviceName)

      const query = new GetMicroserviceNameByIdQuery({
        id: 'microserviceName-123'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(existingMicroserviceName)
      expect(result?.id).toBe('microserviceName-123')
      expect(result?.props.name.value).toBe('MicroserviceName Existente')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        'microserviceName-123'
      )
    })

    it('should return null when microserviceName does not exist', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new GetMicroserviceNameByIdQuery({
        id: 'microserviceName-no-existe'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        'microserviceName-no-existe'
      )
    })

    it('should return microserviceName without description when not provided', async () => {
      // Arrange
      const microserviceNameWithoutDesc =
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Sin Descripción'
        })

      Object.defineProperty(microserviceNameWithoutDesc, 'id', {
        value: 'microserviceName-sin-desc'
      })

      queryRepository.getById.mockResolvedValue(
        microserviceNameWithoutDesc
      )

      const query = new GetMicroserviceNameByIdQuery({
        id: 'microserviceName-sin-desc'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(microserviceNameWithoutDesc)
      expect(result?.id).toBe('microserviceName-sin-desc')
      expect(result?.props.name.value).toBe(
        'MicroserviceName Sin Descripción'
      )
      expect(result?.props.description?.value).toBe('')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      queryRepository.getById.mockRejectedValue(repositoryError)

      const query = new GetMicroserviceNameByIdQuery({
        id: 'microserviceName-error'
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        'microserviceName-error'
      )
    })

    it('should handle empty string id', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new GetMicroserviceNameByIdQuery({ id: '' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith('')
    })

    it('should preserve all microserviceName entity properties', async () => {
      // Arrange
      const microserviceNameWithAllProps =
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Completo',
          description: 'Descripción completa del microserviceName'
        })

      Object.defineProperty(microserviceNameWithAllProps, 'id', {
        value: 'microserviceName-completo-123'
      })

      queryRepository.getById.mockResolvedValue(
        microserviceNameWithAllProps
      )

      const query = new GetMicroserviceNameByIdQuery({
        id: 'microserviceName-completo-123'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(microserviceNameWithAllProps)
      expect(result?.id).toBe('microserviceName-completo-123')
      expect(result?.props.name.value).toBe('MicroserviceName Completo')
      expect(result?.props.description?.value).toBe(
        'Descripción completa del microserviceName'
      )
      expect(result?.props.createdAt).toBeInstanceOf(Date)
      expect(result?.props.updatedAt).toBeInstanceOf(Date)
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should handle UUID format ids', async () => {
      // Arrange
      const uuidMicroserviceName = MicroserviceNameEntity.create({
        name: 'MicroserviceName UUID',
        description: 'MicroserviceName con ID en formato UUID'
      })

      const uuidId = '550e8400-e29b-41d4-a716-446655440000'
      Object.defineProperty(uuidMicroserviceName, 'id', {
        value: uuidId
      })

      queryRepository.getById.mockResolvedValue(uuidMicroserviceName)

      const query = new GetMicroserviceNameByIdQuery({ id: uuidId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(uuidMicroserviceName)
      expect(result?.id).toBe(uuidId)
      expect(result?.props.name.value).toBe('MicroserviceName UUID')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(uuidId)
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const specialId = 'microserviceName-123-@#$%^&*()'
      queryRepository.getById.mockResolvedValue(null)

      const query = new GetMicroserviceNameByIdQuery({ id: specialId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(specialId)
    })
  })
})
