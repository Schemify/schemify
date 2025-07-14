/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetAllMicroserviceNameHandler } from './get-all-microserviceName.handler'
import { GetAllMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetAllMicroserviceNameHandler', () => {
  let handler: GetAllMicroserviceNameHandler
  let getAllMicroserviceNamePort: jest.Mocked<GetAllMicroserviceNamePort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMicroserviceNameHandler,
        {
          provide: GetAllMicroserviceNamePort,
          useValue: {
            getAll: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetAllMicroserviceNameHandler)
    getAllMicroserviceNamePort = module.get(GetAllMicroserviceNamePort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return all microserviceNames when repository has data', async () => {
      // Arrange
      const mockMicroserviceNames = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 1',
          description: 'Descripción del microserviceName 1'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 2',
          description: 'Descripción del microserviceName 2'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 3'
        })
      ]

      getAllMicroserviceNamePort.getAll.mockResolvedValue(mockMicroserviceNames)

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(mockMicroserviceNames)
      expect(result).toHaveLength(3)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledTimes(1)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledWith()
    })

    it('should return empty array when no microserviceNames exist', async () => {
      // Arrange
      getAllMicroserviceNamePort.getAll.mockResolvedValue([])

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledTimes(1)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledWith()
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      getAllMicroserviceNamePort.getAll.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(handler.execute()).rejects.toThrow(
        'Database connection failed'
      )
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledTimes(1)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledWith()
    })

    it('should handle single microserviceName result', async () => {
      // Arrange
      const singleMicroserviceName = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Único',
          description: 'Descripción única'
        })
      ]

      getAllMicroserviceNamePort.getAll.mockResolvedValue(
        singleMicroserviceName
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(singleMicroserviceName)
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(MicroserviceNameEntity)
      expect(result[0].props.name.value).toBe('MicroserviceName Único')
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledTimes(1)
    })

    it('should handle large number of microserviceNames', async () => {
      // Arrange
      const largeMicroserviceNameList = Array.from(
        { length: 100 },
        (_, index) =>
          MicroserviceNameEntity.create({
            name: `MicroserviceName ${index + 1}`,
            description: `Descripción del microserviceName ${index + 1}`
          })
      )

      getAllMicroserviceNamePort.getAll.mockResolvedValue(
        largeMicroserviceNameList
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(largeMicroserviceNameList)
      expect(result).toHaveLength(100)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledTimes(1)
      expect(result[0]).toBeInstanceOf(MicroserviceNameEntity)
      expect(result[99]).toBeInstanceOf(MicroserviceNameEntity)
    })

    it('should preserve microserviceName entity properties', async () => {
      // Arrange
      const microserviceNameWithAllProps = MicroserviceNameEntity.create({
        name: 'MicroserviceName Completo',
        description: 'Descripción completa'
      })

      // Override the id for consistent testing
      Object.defineProperty(microserviceNameWithAllProps, 'id', {
        value: 'test-id-123'
      })

      const mockMicroserviceNames = [microserviceNameWithAllProps]
      getAllMicroserviceNamePort.getAll.mockResolvedValue(mockMicroserviceNames)

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('test-id-123')
      expect(result[0].props.name.value).toBe('MicroserviceName Completo')
      expect(result[0].props.description?.value).toBe('Descripción completa')
      expect(result[0].props.createdAt).toBeInstanceOf(Date)
      expect(getAllMicroserviceNamePort.getAll).toHaveBeenCalledTimes(1)
    })
  })
})
