/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetMicromicroByCursorHandler } from './get-micromicro-by-cursor.handler'
import { GetMicromicroByCursorQuery } from './get-micromicro-by-cursor.query'
import { GetMicromicroWithCursorPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('GetMicromicroByCursorHandler', () => {
  let handler: GetMicromicroByCursorHandler
  let getMicromicroWithCursorPort: jest.Mocked<GetMicromicroWithCursorPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMicromicroByCursorHandler,
        {
          provide: GetMicromicroWithCursorPort,
          useValue: {
            getWithCursor: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetMicromicroByCursorHandler)
    getMicromicroWithCursorPort = module.get(
      GetMicromicroWithCursorPort
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return paginated results with cursor when data exists', async () => {
      // Arrange
      const mockMicromicros = [
        MicromicroEntity.create({
          name: 'Micromicro 1',
          description: 'Descripción del micromicro 1'
        }),
        MicromicroEntity.create({
          name: 'Micromicro 2',
          description: 'Descripción del micromicro 2'
        })
      ]

      const mockResult = {
        items: mockMicromicros,
        nextCursor: 'micromicro-2-id',
        hasMore: true
      }

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: 'micromicro-0-id',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toEqual({
        items: mockMicromicros,
        nextCursor: 'micromicro-2-id',
        hasMore: true
      })
      expect(result.items).toHaveLength(2)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('micromicro-0-id', 2)
    })

    it('should return empty results when no data exists', async () => {
      // Arrange
      const mockResult = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: 'last-micromicro-id',
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
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('last-micromicro-id', 10)
    })

    it('should handle first page request (no afterId)', async () => {
      // Arrange
      const mockMicromicros = [
        MicromicroEntity.create({
          name: 'Primer Micromicro'
        }),
        MicromicroEntity.create({
          name: 'Segundo Micromicro'
        })
      ]

      const mockResult = {
        items: mockMicromicros,
        nextCursor: 'segundo-micromicro-id',
        hasMore: true
      }

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: '',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(2)
      expect(result.nextCursor).toBe('segundo-micromicro-id')
      expect(result.hasMore).toBe(true)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('', 2)
    })

    it('should handle last page (no more data)', async () => {
      // Arrange
      const mockMicromicros = [
        MicromicroEntity.create({
          name: 'Último Micromicro'
        })
      ]

      const mockResult = {
        items: mockMicromicros,
        nextCursor: null,
        hasMore: false
      }

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: 'penultimo-micromicro-id',
        limit: 5
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.nextCursor).toBeNull()
      expect(result.hasMore).toBe(false)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('penultimo-micromicro-id', 5)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      getMicromicroWithCursorPort.getWithCursor.mockRejectedValue(
        repositoryError
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: 'some-id',
        limit: 10
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('some-id', 10)
    })

    it('should handle large limit values', async () => {
      // Arrange
      const largeMicromicroList = Array.from(
        { length: 100 },
        (_, index) =>
          MicromicroEntity.create({
            name: `Micromicro ${index + 1}`,
            description: `Descripción ${index + 1}`
          })
      )

      const mockResult = {
        items: largeMicromicroList,
        nextCursor: 'micromicro-100-id',
        hasMore: true
      }

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: 'micromicro-0-id',
        limit: 100
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(100)
      expect(result.nextCursor).toBe('micromicro-100-id')
      expect(result.hasMore).toBe(true)
      expect(
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('micromicro-0-id', 100)
    })

    it('should preserve micromicro entity properties in paginated results', async () => {
      // Arrange
      const micromicroWithProps =
        MicromicroEntity.create({
          name: 'Micromicro Test',
          description: 'Descripción de prueba'
        })

      // Override the id for consistent testing
      Object.defineProperty(micromicroWithProps, 'id', {
        value: 'test-id-123'
      })

      const mockResult = {
        items: [micromicroWithProps],
        nextCursor: 'test-id-123',
        hasMore: false
      }

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
        afterId: 'previous-id',
        limit: 1
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe('test-id-123')
      expect(result.items[0].props.name.value).toBe(
        'Micromicro Test'
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

      getMicromicroWithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new GetMicromicroByCursorQuery({
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
        getMicromicroWithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('some-id', 0)
    })
  })
})
