/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetMicroserviceNameByCursorHandler } from './get-microserviceName-by-cursor.handler'
import { GetMicroserviceNameByCursorQuery } from './get-microserviceName-by-cursor.query'
import { GetMicroserviceNameWithCursorPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetMicroserviceNameByCursorHandler', () => {
  let handler: GetMicroserviceNameByCursorHandler
  let getMicroserviceNameWithCursorPort: jest.Mocked<GetMicroserviceNameWithCursorPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMicroserviceNameByCursorHandler,
        {
          provide: GetMicroserviceNameWithCursorPort,
          useValue: {
            getWithCursor: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetMicroserviceNameByCursorHandler)
    getMicroserviceNameWithCursorPort = module.get(
      GetMicroserviceNameWithCursorPort
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return paginated results with cursor when data exists', async () => {
      // Arrange
      const mockMicroserviceNames = [
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 1',
          description: 'Descripción del microserviceName 1'
        }),
        MicroserviceNameEntity.create({
          name: 'MicroserviceName 2',
          description: 'Descripción del microserviceName 2'
        })
      ]

      const mockResult = {
        items: mockMicroserviceNames,
        nextCursor: 'microserviceName-2-id',
        hasMore: true
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'microserviceName-0-id',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toEqual({
        items: mockMicroserviceNames,
        nextCursor: 'microserviceName-2-id',
        hasMore: true
      })
      expect(result.items).toHaveLength(2)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('microserviceName-0-id', 2)
    })

    it('should return empty results when no data exists', async () => {
      // Arrange
      const mockResult = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'last-microserviceName-id',
        limit: 10
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toEqual({
        items: [],
        nextCursor: null,
        hasMore: false
      })
      expect(result.items).toHaveLength(0)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('last-microserviceName-id', 10)
    })

    it('should handle first page request (no afterId)', async () => {
      // Arrange
      const mockMicroserviceNames = [
        MicroserviceNameEntity.create({
          name: 'Primer MicroserviceName'
        }),
        MicroserviceNameEntity.create({
          name: 'Segundo MicroserviceName'
        })
      ]

      const mockResult = {
        items: mockMicroserviceNames,
        nextCursor: 'segundo-microserviceName-id',
        hasMore: true
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: '',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(2)
      expect(result.nextCursor).toBe('segundo-microserviceName-id')
      expect(result.hasMore).toBe(true)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('', 2)
    })

    it('should handle last page (no more data)', async () => {
      // Arrange
      const mockMicroserviceNames = [
        MicroserviceNameEntity.create({
          name: 'Último MicroserviceName'
        })
      ]

      const mockResult = {
        items: mockMicroserviceNames,
        nextCursor: null,
        hasMore: false
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'penultimo-microserviceName-id',
        limit: 5
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.nextCursor).toBeNull()
      expect(result.hasMore).toBe(false)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('penultimo-microserviceName-id', 5)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      getMicroserviceNameWithCursorPort.getWithCursor.mockRejectedValue(
        repositoryError
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'some-id',
        limit: 10
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('some-id', 10)
    })

    it('should handle large limit values', async () => {
      // Arrange
      const largeMicroserviceNameList = Array.from(
        { length: 100 },
        (_, index) =>
          MicroserviceNameEntity.create({
            name: `MicroserviceName ${index + 1}`,
            description: `Descripción ${index + 1}`
          })
      )

      const mockResult = {
        items: largeMicroserviceNameList,
        nextCursor: 'microserviceName-100-id',
        hasMore: true
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'microserviceName-0-id',
        limit: 100
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(100)
      expect(result.nextCursor).toBe('microserviceName-100-id')
      expect(result.hasMore).toBe(true)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('microserviceName-0-id', 100)
    })

    it('should preserve microserviceName entity properties in paginated results', async () => {
      // Arrange
      const microserviceNameWithProps =
        MicroserviceNameEntity.create({
          name: 'MicroserviceName Test',
          description: 'Descripción de prueba'
        })

      // Override the id for consistent testing
      Object.defineProperty(microserviceNameWithProps, 'id', {
        value: 'test-id-123'
      })

      const mockResult = {
        items: [microserviceNameWithProps],
        nextCursor: 'test-id-123',
        hasMore: false
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'previous-id',
        limit: 1
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe('test-id-123')
      expect(result.items[0].props.name.value).toBe(
        'MicroserviceName Test'
      )
      expect(result.items[0].props.description?.value).toBe(
        'Descripción de prueba'
      )
      expect(result.items[0].props.createdAt).toBeInstanceOf(Date)
      expect(result.nextCursor).toBe('test-id-123')
      expect(result.hasMore).toBe(false)
    })

    it('should handle zero limit gracefully', async () => {
      // Arrange
      const mockResult = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      getMicroserviceNameWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicroserviceNameByCursorQuery({
        afterId: 'some-id',
        limit: 0
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(0)
      expect(result.nextCursor).toBeNull()
      expect(result.hasMore).toBe(false)
      expect(
        getMicroserviceNameWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('some-id', 0)
    })
  })
})
