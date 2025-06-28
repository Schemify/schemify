/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Get__project_name_pascal__ByCursorHandler } from './get-__project_name_camel__-by-cursor.handler'
import { Get__project_name_pascal__ByCursorQuery } from './get-__project_name_camel__-by-cursor.query'
import { Get__project_name_pascal__WithCursorPort } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-query-ports'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Get__project_name_pascal__ByCursorHandler', () => {
  let handler: Get__project_name_pascal__ByCursorHandler
  let get__project_name_pascal__WithCursorPort: jest.Mocked<Get__project_name_pascal__WithCursorPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Get__project_name_pascal__ByCursorHandler,
        {
          provide: Get__project_name_pascal__WithCursorPort,
          useValue: {
            getWithCursor: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(Get__project_name_pascal__ByCursorHandler)
    get__project_name_pascal__WithCursorPort = module.get(
      Get__project_name_pascal__WithCursorPort
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return paginated results with cursor when data exists', async () => {
      // Arrange
      const mock__project_name_pascal__s = [
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ 1',
          description: 'Descripción del __project_name_camel__ 1'
        }),
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ 2',
          description: 'Descripción del __project_name_camel__ 2'
        })
      ]

      const mockResult = {
        items: mock__project_name_pascal__s,
        nextCursor: '__project_name_camel__-2-id',
        hasMore: true
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: '__project_name_camel__-0-id',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toEqual({
        items: mock__project_name_pascal__s,
        nextCursor: '__project_name_camel__-2-id',
        hasMore: true
      })
      expect(result.items).toHaveLength(2)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('__project_name_camel__-0-id', 2)
    })

    it('should return empty results when no data exists', async () => {
      // Arrange
      const mockResult = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'last-__project_name_camel__-id',
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
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('last-__project_name_camel__-id', 10)
    })

    it('should handle first page request (no afterId)', async () => {
      // Arrange
      const mock__project_name_pascal__s = [
        __project_name_pascal__Entity.create({
          name: 'Primer __project_name_pascal__'
        }),
        __project_name_pascal__Entity.create({
          name: 'Segundo __project_name_pascal__'
        })
      ]

      const mockResult = {
        items: mock__project_name_pascal__s,
        nextCursor: 'segundo-__project_name_camel__-id',
        hasMore: true
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: '',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(2)
      expect(result.nextCursor).toBe('segundo-__project_name_camel__-id')
      expect(result.hasMore).toBe(true)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('', 2)
    })

    it('should handle last page (no more data)', async () => {
      // Arrange
      const mock__project_name_pascal__s = [
        __project_name_pascal__Entity.create({
          name: 'Último __project_name_pascal__'
        })
      ]

      const mockResult = {
        items: mock__project_name_pascal__s,
        nextCursor: null,
        hasMore: false
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'penultimo-__project_name_camel__-id',
        limit: 5
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.nextCursor).toBeNull()
      expect(result.hasMore).toBe(false)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('penultimo-__project_name_camel__-id', 5)
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      get__project_name_pascal__WithCursorPort.getWithCursor.mockRejectedValue(
        repositoryError
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'some-id',
        limit: 10
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledTimes(1)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('some-id', 10)
    })

    it('should handle large limit values', async () => {
      // Arrange
      const large__project_name_pascal__List = Array.from(
        { length: 100 },
        (_, index) =>
          __project_name_pascal__Entity.create({
            name: `__project_name_pascal__ ${index + 1}`,
            description: `Descripción ${index + 1}`
          })
      )

      const mockResult = {
        items: large__project_name_pascal__List,
        nextCursor: '__project_name_camel__-100-id',
        hasMore: true
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: '__project_name_camel__-0-id',
        limit: 100
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(100)
      expect(result.nextCursor).toBe('__project_name_camel__-100-id')
      expect(result.hasMore).toBe(true)
      expect(
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('__project_name_camel__-0-id', 100)
    })

    it('should preserve __project_name_camel__ entity properties in paginated results', async () => {
      // Arrange
      const __project_name_camel__WithProps =
        __project_name_pascal__Entity.create({
          name: '__project_name_pascal__ Test',
          description: 'Descripción de prueba'
        })

      // Override the id for consistent testing
      Object.defineProperty(__project_name_camel__WithProps, 'id', {
        value: 'test-id-123'
      })

      const mockResult = {
        items: [__project_name_camel__WithProps],
        nextCursor: 'test-id-123',
        hasMore: false
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'previous-id',
        limit: 1
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe('test-id-123')
      expect(result.items[0].props.name.value).toBe(
        '__project_name_pascal__ Test'
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

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(
        mockResult
      )

      const query = new Get__project_name_pascal__ByCursorQuery({
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
        get__project_name_pascal__WithCursorPort.getWithCursor
      ).toHaveBeenCalledWith('some-id', 0)
    })
  })
})
