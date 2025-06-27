/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetAllMicromicroHandler } from './get-all-micromicro.handler'
import { GetAllMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('GetAllMicromicroHandler', () => {
  let handler: GetAllMicromicroHandler
  let getAllMicromicroPort: jest.Mocked<GetAllMicromicroPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMicromicroHandler,
        {
          provide: GetAllMicromicroPort,
          useValue: {
            getAll: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetAllMicromicroHandler)
    getAllMicromicroPort = module.get(
      GetAllMicromicroPort
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return all micromicros when repository has data', async () => {
      // Arrange
      const mockMicromicros = [
        MicromicroEntity.create({
          name: 'Micromicro 1',
          description: 'Descripción del micromicro 1'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 2',
          description: 'Descripción del micromicro 2'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 3'
        })
      ]

      getAllMicromicroPort.getAll.mockResolvedValue(
        mockMicromicros
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(mockMicromicros)
      expect(result).toHaveLength(3)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledTimes(1)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledWith()
    })

    it('should return empty array when no micromicros exist', async () => {
      // Arrange
      getAllMicromicroPort.getAll.mockResolvedValue([])

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledTimes(1)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledWith()
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      getAllMicromicroPort.getAll.mockRejectedValue(
        repositoryError
      )

      // Act & Assert
      await expect(handler.execute()).rejects.toThrow(
        'Database connection failed'
      )
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledTimes(1)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledWith()
    })

    it('should handle single micromicro result', async () => {
      // Arrange
      const singleMicromicro = [
        MicromicroEntity.create({
          name: 'Micromicro Único',
          description: 'Descripción única'
        })
      ]

      getAllMicromicroPort.getAll.mockResolvedValue(
        singleMicromicro
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(singleMicromicro)
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(MicromicroEntity)
      expect(result[0].props.name.value).toBe('Micromicro Único')
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledTimes(1)
    })

    it('should handle large number of micromicros', async () => {
      // Arrange
      const largeMicromicroList = Array.from(
        { length: 100 },
        (_, index) =>
          MicromicroEntity.create({
            name: `Micromicro ${index + 1}`,
            description: `Descripción del micromicro ${index + 1}`
          })
      )

      getAllMicromicroPort.getAll.mockResolvedValue(
        largeMicromicroList
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(largeMicromicroList)
      expect(result).toHaveLength(100)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledTimes(1)
      expect(result[0]).toBeInstanceOf(MicromicroEntity)
      expect(result[99]).toBeInstanceOf(MicromicroEntity)
    })

    it('should preserve micromicro entity properties', async () => {
      // Arrange
      const micromicroWithAllProps =
        MicromicroEntity.create({
          name: 'Micromicro Completo',
          description: 'Descripción completa'
        })

      // Override the id for consistent testing
      Object.defineProperty(micromicroWithAllProps, 'id', {
        value: 'test-id-123'
      })

      const mockMicromicros = [micromicroWithAllProps]
      getAllMicromicroPort.getAll.mockResolvedValue(
        mockMicromicros
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('test-id-123')
      expect(result[0].props.name.value).toBe(
        'Micromicro Completo'
      )
      expect(result[0].props.description?.value).toBe('Descripción completa')
      expect(result[0].props.createdAt).toBeInstanceOf(Date)
      expect(getAllMicromicroPort.getAll).toHaveBeenCalledTimes(1)
    })
  })
})
