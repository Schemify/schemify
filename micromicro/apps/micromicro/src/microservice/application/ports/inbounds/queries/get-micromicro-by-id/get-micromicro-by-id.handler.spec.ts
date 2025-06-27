/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetMicromicroByIdHandler } from './get-micromicro-by-id.handler'
import { GetMicromicroByIdQuery } from './get-micromicro-by-id.query'
import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('GetMicromicroByIdHandler', () => {
  let handler: GetMicromicroByIdHandler
  let queryRepository: jest.Mocked<GetMicromicroByIdPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMicromicroByIdHandler,
        {
          provide: GetMicromicroByIdPort,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetMicromicroByIdHandler)
    queryRepository = module.get(GetMicromicroByIdPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return micromicro when it exists', async () => {
      // Arrange
      const existingMicromicro =
        MicromicroEntity.create({
          name: 'Micromicro Existente',
          description: 'Descripción del micromicro'
        })

      // Override the id for consistent testing
      Object.defineProperty(existingMicromicro, 'id', {
        value: 'micromicro-123'
      })

      queryRepository.getById.mockResolvedValue(existingMicromicro)

      const query = new GetMicromicroByIdQuery({
        id: 'micromicro-123'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(existingMicromicro)
      expect(result?.id).toBe('micromicro-123')
      expect(result?.props.name.value).toBe('Micromicro Existente')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        'micromicro-123'
      )
    })

    it('should return null when micromicro does not exist', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new GetMicromicroByIdQuery({
        id: 'micromicro-no-existe'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        'micromicro-no-existe'
      )
    })

    it('should return micromicro without description when not provided', async () => {
      // Arrange
      const micromicroWithoutDesc =
        MicromicroEntity.create({
          name: 'Micromicro Sin Descripción'
        })

      Object.defineProperty(micromicroWithoutDesc, 'id', {
        value: 'micromicro-sin-desc'
      })

      queryRepository.getById.mockResolvedValue(
        micromicroWithoutDesc
      )

      const query = new GetMicromicroByIdQuery({
        id: 'micromicro-sin-desc'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(micromicroWithoutDesc)
      expect(result?.id).toBe('micromicro-sin-desc')
      expect(result?.props.name.value).toBe(
        'Micromicro Sin Descripción'
      )
      expect(result?.props.description?.value).toBe('')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      queryRepository.getById.mockRejectedValue(repositoryError)

      const query = new GetMicromicroByIdQuery({
        id: 'micromicro-error'
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(
        'micromicro-error'
      )
    })

    it('should handle empty string id', async () => {
      // Arrange
      queryRepository.getById.mockResolvedValue(null)

      const query = new GetMicromicroByIdQuery({ id: '' })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith('')
    })

    it('should preserve all micromicro entity properties', async () => {
      // Arrange
      const micromicroWithAllProps =
        MicromicroEntity.create({
          name: 'Micromicro Completo',
          description: 'Descripción completa del micromicro'
        })

      Object.defineProperty(micromicroWithAllProps, 'id', {
        value: 'micromicro-completo-123'
      })

      queryRepository.getById.mockResolvedValue(
        micromicroWithAllProps
      )

      const query = new GetMicromicroByIdQuery({
        id: 'micromicro-completo-123'
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(micromicroWithAllProps)
      expect(result?.id).toBe('micromicro-completo-123')
      expect(result?.props.name.value).toBe('Micromicro Completo')
      expect(result?.props.description?.value).toBe(
        'Descripción completa del micromicro'
      )
      expect(result?.props.createdAt).toBeInstanceOf(Date)
      expect(result?.props.updatedAt).toBeInstanceOf(Date)
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
    })

    it('should handle UUID format ids', async () => {
      // Arrange
      const uuidMicromicro = MicromicroEntity.create({
        name: 'Micromicro UUID',
        description: 'Micromicro con ID en formato UUID'
      })

      const uuidId = '550e8400-e29b-41d4-a716-446655440000'
      Object.defineProperty(uuidMicromicro, 'id', {
        value: uuidId
      })

      queryRepository.getById.mockResolvedValue(uuidMicromicro)

      const query = new GetMicromicroByIdQuery({ id: uuidId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBe(uuidMicromicro)
      expect(result?.id).toBe(uuidId)
      expect(result?.props.name.value).toBe('Micromicro UUID')
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(uuidId)
    })

    it('should handle special characters in id', async () => {
      // Arrange
      const specialId = 'micromicro-123-@#$%^&*()'
      queryRepository.getById.mockResolvedValue(null)

      const query = new GetMicromicroByIdQuery({ id: specialId })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toBeNull()
      expect(queryRepository.getById).toHaveBeenCalledTimes(1)
      expect(queryRepository.getById).toHaveBeenCalledWith(specialId)
    })
  })
})
