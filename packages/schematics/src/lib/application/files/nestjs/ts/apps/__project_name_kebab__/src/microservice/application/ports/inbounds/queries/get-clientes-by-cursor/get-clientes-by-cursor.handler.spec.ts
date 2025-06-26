/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Get__project_name_pascal__ByCursorHandler } from './get-__project_name_kebab__-by-cursor.handler'
import { Get__project_name_pascal__ByCursorQuery } from './get-__project_name_kebab__-by-cursor.query'
import { Get__project_name_pascal__WithCursorPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

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
    get__project_name_pascal__WithCursorPort = module.get(Get__project_name_pascal__WithCursorPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return paginated results with cursor when data exists', async () => {
      // Arrange
      const mockClients = [
        __project_name_pascal__Entity.create({
          name: 'Cliente 1',
          description: 'Descripción del cliente 1'
        }),
        __project_name_pascal__Entity.create({
          name: 'Cliente 2',
          description: 'Descripción del cliente 2'
        })
      ]

      const mockResult = {
        items: mockClients,
        nextCursor: 'cliente-2-id',
        hasMore: true
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'cliente-0-id',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result).toEqual({
        items: mockClients,
        nextCursor: 'cliente-2-id',
        hasMore: true
      })
      expect(result.items).toHaveLength(2)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledTimes(1)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        'cliente-0-id',
        2
      )
    })

    it('should return empty results when no data exists', async () => {
      // Arrange
      const mockResult = {
        items: [],
        nextCursor: null,
        hasMore: false
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'last-client-id',
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
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledTimes(1)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        'last-client-id',
        10
      )
    })

    it('should handle first page request (no afterId)', async () => {
      // Arrange
      const mockClients = [
        __project_name_pascal__Entity.create({ name: 'Primer Cliente' }),
        __project_name_pascal__Entity.create({ name: 'Segundo Cliente' })
      ]

      const mockResult = {
        items: mockClients,
        nextCursor: 'segundo-cliente-id',
        hasMore: true
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: '',
        limit: 2
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(2)
      expect(result.nextCursor).toBe('segundo-cliente-id')
      expect(result.hasMore).toBe(true)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        '',
        2
      )
    })

    it('should handle last page (no more data)', async () => {
      // Arrange
      const mockClients = [__project_name_pascal__Entity.create({ name: 'Último Cliente' })]

      const mockResult = {
        items: mockClients,
        nextCursor: null,
        hasMore: false
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'penultimo-cliente-id',
        limit: 5
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.nextCursor).toBeNull()
      expect(result.hasMore).toBe(false)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        'penultimo-cliente-id',
        5
      )
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      get__project_name_pascal__WithCursorPort.getWithCursor.mockRejectedValue(repositoryError)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'some-id',
        limit: 10
      })

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed'
      )
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledTimes(1)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        'some-id',
        10
      )
    })

    it('should handle large limit values', async () => {
      // Arrange
      const largeClientList = Array.from({ length: 100 }, (_, index) =>
        __project_name_pascal__Entity.create({
          name: `Cliente ${index + 1}`,
          description: `Descripción ${index + 1}`
        })
      )

      const mockResult = {
        items: largeClientList,
        nextCursor: 'cliente-100-id',
        hasMore: true
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'cliente-0-id',
        limit: 100
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(100)
      expect(result.nextCursor).toBe('cliente-100-id')
      expect(result.hasMore).toBe(true)
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        'cliente-0-id',
        100
      )
    })

    it('should preserve client entity properties in paginated results', async () => {
      // Arrange
      const clientWithProps = __project_name_pascal__Entity.create({
        name: 'Cliente Test',
        description: 'Descripción de prueba'
      })

      // Override the id for consistent testing
      Object.defineProperty(clientWithProps, 'id', { value: 'test-id-123' })

      const mockResult = {
        items: [clientWithProps],
        nextCursor: 'test-id-123',
        hasMore: false
      }

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

      const query = new Get__project_name_pascal__ByCursorQuery({
        afterId: 'previous-id',
        limit: 1
      })

      // Act
      const result = await handler.execute(query)

      // Assert
      expect(result.items).toHaveLength(1)
      expect(result.items[0].id).toBe('test-id-123')
      expect(result.items[0].props.name.value).toBe('Cliente Test')
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

      get__project_name_pascal__WithCursorPort.getWithCursor.mockResolvedValue(mockResult)

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
      expect(get__project_name_pascal__WithCursorPort.getWithCursor).toHaveBeenCalledWith(
        'some-id',
        0
      )
    })
  })
})
