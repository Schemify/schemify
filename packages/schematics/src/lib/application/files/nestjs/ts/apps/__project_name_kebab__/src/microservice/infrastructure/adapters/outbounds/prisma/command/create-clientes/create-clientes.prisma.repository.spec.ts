import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { Create__project_name_pascal__PrismaRepository } from './create-__project_name_kebab__.prisma.repository'
import { __project_name_pascal__Mapper } from '@__project_name_kebab__/microservice/infrastructure/mappers/__project_name_kebab__.mapper'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'

describe('Create__project_name_pascal__PrismaRepository', () => {
  let repository: Create__project_name_pascal__PrismaRepository
  let createSpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      __project_name_kebab__: {
        create: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Create__project_name_pascal__PrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: __project_name_pascal__Mapper,
          useValue: mockMapper
        }
      ]
    }).compile()

    repository = module.get<Create__project_name_pascal__PrismaRepository>(
      Create__project_name_pascal__PrismaRepository
    )
    createSpy = mockPrismaService.__project_name_kebab__.create
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create __project_name_camel__ successfully', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_pascal__Entity.create({
        name: 'Test Cliente',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: __project_name_camel__.id,
        name: 'Test Cliente',
        description: 'Test Description',
        createdAt: __project_name_camel__.props.createdAt,
        updatedAt: __project_name_camel__.props.updatedAt
      }

      const mockMappedEntity = __project_name_pascal__Entity.create({
        name: 'Test Cliente',
        description: 'Test Description'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(mockMappedEntity)

      // Act
      const result = await repository.create(__project_name_camel__)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: __project_name_camel__.id,
          name: __project_name_camel__.props.name.value,
          description: __project_name_camel__.props.description?.value ?? null,
          createdAt: __project_name_camel__.props.createdAt,
          updatedAt: __project_name_camel__.props.updatedAt
        }
      })

      expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockCreatedData)
      expect(result).toBe(mockMappedEntity)
    })

    it('should handle __project_name_camel__ without description', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_pascal__Entity.create({
        name: 'Test Cliente'
        // No description
      })

      const mockCreatedData = {
        id: __project_name_camel__.id,
        name: 'Test Cliente',
        description: '',
        createdAt: __project_name_camel__.props.createdAt,
        updatedAt: __project_name_camel__.props.updatedAt
      }

      const mockMappedEntity = __project_name_pascal__Entity.create({
        name: 'Test Cliente'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(mockMappedEntity)

      // Act
      const result = await repository.create(__project_name_camel__)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: __project_name_camel__.id,
          name: __project_name_camel__.props.name.value,
          description: '',
          createdAt: __project_name_camel__.props.createdAt,
          updatedAt: __project_name_camel__.props.updatedAt
        }
      })

      expect(result).toBe(mockMappedEntity)
    })

    it('should handle database errors', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_pascal__Entity.create({
        name: 'Test Cliente',
        description: 'Test Description'
      })

      const dbError = new Error('Database connection failed')
      createSpy.mockRejectedValue(dbError)

      // Act & Assert
      await expect(repository.create(__project_name_camel__)).rejects.toThrow(
        'Database connection failed'
      )
      expect(createSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_pascal__Entity.create({
        name: 'Test Cliente',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: __project_name_camel__.id,
        name: 'Test Cliente',
        description: 'Test Description',
        createdAt: __project_name_camel__.props.createdAt,
        updatedAt: __project_name_camel__.props.updatedAt
      }

      const mapperError = new Error('Mapping failed')
      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(repository.create(__project_name_camel__)).rejects.toThrow(
        'Mapping failed'
      )
      expect(createSpy).toHaveBeenCalledTimes(1)
      expect(fromPrimitivesSpy).toHaveBeenCalledTimes(1)
    })

    it('should pass correct data structure to prisma', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_pascal__Entity.create({
        name: 'Test Cliente',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: __project_name_camel__.id,
        name: 'Test Cliente',
        description: 'Test Description',
        createdAt: __project_name_camel__.props.createdAt,
        updatedAt: __project_name_camel__.props.updatedAt
      }

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(__project_name_camel__)

      // Act
      await repository.create(__project_name_camel__)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          name: 'Test Cliente',
          description: 'Test Description',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    })

    it('should return mapped entity from mapper', async () => {
      // Arrange
      const __project_name_camel__ = __project_name_pascal__Entity.create({
        name: 'Test Cliente',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: __project_name_camel__.id,
        name: 'Test Cliente',
        description: 'Test Description',
        createdAt: __project_name_camel__.props.createdAt,
        updatedAt: __project_name_camel__.props.updatedAt
      }

      const expectedMappedEntity = __project_name_pascal__Entity.create({
        name: 'Mapped Cliente',
        description: 'Mapped Description'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(expectedMappedEntity)

      // Act
      const result = await repository.create(__project_name_camel__)

      // Assert
      expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockCreatedData)
      expect(result).toBe(expectedMappedEntity)
    })
  })
})
