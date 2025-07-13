/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { GetAll__project_name_camel__Handler } from './get-all-__project_name_kebab__.handler'
import { GetAll__project_name_pascal__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { __project_name_camel__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

describe('GetAll__project_name_camel__Handler', () => {
  let handler: GetAll__project_name_camel__Handler
  let getAll__project_name_pascal__Port: jest.Mocked<GetAll__project_name_pascal__Port>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAll__project_name_camel__Handler,
        {
          provide: GetAll__project_name_pascal__Port,
          useValue: {
            getAll: jest.fn()
          }
        }
      ]
    }).compile()

    handler = module.get(GetAll__project_name_camel__Handler)
    getAll__project_name_pascal__Port = module.get(
      GetAll__project_name_pascal__Port
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should return all __project_name_camel__s when repository has data', async () => {
      // Arrange
      const mock__project_name_camel__s = [
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 1',
          description: 'Descripción del __project_name_camel__ 1'
        }),
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 2',
          description: 'Descripción del __project_name_camel__ 2'
        }),
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ 3'
        })
      ]

      getAll__project_name_pascal__Port.getAll.mockResolvedValue(
        mock__project_name_camel__s
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(mock__project_name_camel__s)
      expect(result).toHaveLength(3)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledWith()
    })

    it('should return empty array when no __project_name_camel__s exist', async () => {
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
      getAll__project_name_pascal__Port.getAll.mockRejectedValue(
        repositoryError
      )

      // Act & Assert
      await expect(handler.execute()).rejects.toThrow(
        'Database connection failed'
      )
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledWith()
    })

    it('should handle single __project_name_camel__ result', async () => {
      // Arrange
      const single__project_name_camel__ = [
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ Único',
          description: 'Descripción única'
        })
      ]

      getAll__project_name_pascal__Port.getAll.mockResolvedValue(
        single__project_name_camel__
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(single__project_name_camel__)
      expect(result).toHaveLength(1)
      expect(result[0]).toBeInstanceOf(__project_name_camel__Entity)
      expect(result[0].props.name.value).toBe('__project_name_camel__ Único')
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
    })

    it('should handle large number of __project_name_camel__s', async () => {
      // Arrange
      const large__project_name_camel__List = Array.from(
        { length: 100 },
        (_, index) =>
          __project_name_camel__Entity.create({
            name: `__project_name_camel__ ${index + 1}`,
            description: `Descripción del __project_name_camel__ ${index + 1}`
          })
      )

      getAll__project_name_pascal__Port.getAll.mockResolvedValue(
        large__project_name_camel__List
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toBe(large__project_name_camel__List)
      expect(result).toHaveLength(100)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
      expect(result[0]).toBeInstanceOf(__project_name_camel__Entity)
      expect(result[99]).toBeInstanceOf(__project_name_camel__Entity)
    })

    it('should preserve __project_name_camel__ entity properties', async () => {
      // Arrange
      const __project_name_camel__WithAllProps =
        __project_name_camel__Entity.create({
          name: '__project_name_camel__ Completo',
          description: 'Descripción completa'
        })

      // Override the id for consistent testing
      Object.defineProperty(__project_name_camel__WithAllProps, 'id', {
        value: 'test-id-123'
      })

      const mock__project_name_camel__s = [__project_name_camel__WithAllProps]
      getAll__project_name_pascal__Port.getAll.mockResolvedValue(
        mock__project_name_camel__s
      )

      // Act
      const result = await handler.execute()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('test-id-123')
      expect(result[0].props.name.value).toBe('__project_name_camel__ Completo')
      expect(result[0].props.description?.value).toBe('Descripción completa')
      expect(result[0].props.createdAt).toBeInstanceOf(Date)
      expect(getAll__project_name_pascal__Port.getAll).toHaveBeenCalledTimes(1)
    })
  })
})
