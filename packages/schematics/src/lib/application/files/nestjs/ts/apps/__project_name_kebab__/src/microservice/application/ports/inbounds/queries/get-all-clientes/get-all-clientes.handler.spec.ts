/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetAll__project_name_pascal__Handler } from './get-all-__project_name_kebab__.handler'
import { GetAll__project_name_pascal__Port } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

describe('GetAll__project_name_pascal__Handler', () => {
  let handler: GetAll__project_name_pascal__Handler
  let getAll__project_name_pascal__Port: jest.Mocked<GetAll__project_name_pascal__Port>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAll__project_name_pascal__Handler,
        {
          provide: GetAll__project_name_pascal__Port,
          useValue: {
            getAll: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetAll__project_name_pascal__Handler)
    getAll__project_name_pascal__Port = module.get(GetAll__project_name_pascal__Port)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return all clients when repository has data', async () => {
      // Arrange
      const mockClients = [
        __project_name_pascal__Entity.create({
          name: 'Cliente 1',
          description: 'Descripción del cliente 1'
        }),
        __project_name_pascal__Entity.create({
          name: 'Cliente 2',
          description: 'Descripción del cliente 2'
        }),
        __project_name_pascal__Entity.create({
          name: 'Cliente 3'
        })
      ]

      getAll__project_name_pascal__Port.getAll.mockResolvedValue(mockClients)

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(mockClients)
      expect(result).toHaveLength(3)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledWith()
    })

    it('should return empty array when no clients exist', async () => {
      // Arrange
      getAll__project_name_pascal__Port.getAll.mockResolvedValue([])

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledWith()
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed')
      getAll__project_name_pascal__Port.getAll.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(handler.execute()).rejects.toThrow(
        'Database connection failed'
      )
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledWith()
    })

    it('should handle single client result', async () => {
      // Arrange
      const singleClient = [
        __project_name_pascal__Entity.create({
          name: 'Cliente Único',
          description: 'Descripción única'
        })
      ]

      getAll__project_name_pascal__Port.getAll.mockResolvedValue(singleClient)

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(singleClient)
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(__project_name_pascal__Entity)
      expect(result[0].props.name.value).toBe('Cliente Único')
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
    })

    it('should handle large number of clients', async () => {
      // Arrange
      const largeClientList = Array.from({ length: 100 }, (_, index) =>
        __project_name_pascal__Entity.create({
          name: `Cliente ${index + 1}`,
          description: `Descripción del cliente ${index + 1}`
        })
      )

      getAll__project_name_pascal__Port.getAll.mockResolvedValue(largeClientList)

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(largeClientList)
      expect(result).toHaveLength(100)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(result[0]).toBeInstanceOf(__project_name_pascal__Entity)
      expect(result[99]).toBeInstanceOf(__project_name_pascal__Entity)
    })

    it('should preserve client entity properties', async () => {
      // Arrange
      const clientWithAllProps = __project_name_pascal__Entity.create({
        name: 'Cliente Completo',
        description: 'Descripción completa'
      })

      // Override the id for consistent testing
      Object.defineProperty(clientWithAllProps, 'id', { value: 'test-id-123' })

      const mockClients = [clientWithAllProps]
      getAll__project_name_pascal__Port.getAll.mockResolvedValue(mockClients)

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('test-id-123')
      expect(result[0].props.name.value).toBe('Cliente Completo')
      expect(result[0].props.description?.value).toBe('Descripción completa')
      expect(result[0].props.createdAt).toBeInstanceOf(Date)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
    })
  })
})
