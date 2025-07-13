import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { CreateMicroserviceNamePrismaRepository } from './create-microserviceName.prisma.repository'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('CreateMicroserviceNamePrismaRepository', () => {
  let repository: CreateMicroserviceNamePrismaRepository
  let createSpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      microserviceName: {
        create: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMicroserviceNamePrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: MicroserviceNameMapper,
          useValue: mockMapper
        }
      ]
    }).compile()

    repository = module.get<CreateMicroserviceNamePrismaRepository>(
      CreateMicroserviceNamePrismaRepository
    )
    createSpy = mockPrismaService.microserviceName.create
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create microserviceName successfully', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: microserviceName.id,
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: microserviceName.props.createdAt,
        updatedAt: microserviceName.props.updatedAt
      }

      const mockMappedEntity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(mockMappedEntity)

      // Act
      const result = await repository.create(microserviceName)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: microserviceName.id,
          name: microserviceName.props.name.value,
          description: microserviceName.props.description?.value ?? null,
          createdAt: microserviceName.props.createdAt,
          updatedAt: microserviceName.props.updatedAt
        }
      })

      expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockCreatedData)
      expect(result).toBe(mockMappedEntity)
    })

    it('should handle microserviceName without description', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName'
        // No description
      })

      const mockCreatedData = {
        id: microserviceName.id,
        name: 'Test MicroserviceName',
        description: '',
        createdAt: microserviceName.props.createdAt,
        updatedAt: microserviceName.props.updatedAt
      }

      const mockMappedEntity = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(mockMappedEntity)

      // Act
      const result = await repository.create(microserviceName)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: microserviceName.id,
          name: microserviceName.props.name.value,
          description: '',
          createdAt: microserviceName.props.createdAt,
          updatedAt: microserviceName.props.updatedAt
        }
      })

      expect(result).toBe(mockMappedEntity)
    })

    it('should handle database errors', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      const dbError = new Error('Database connection failed')
      createSpy.mockRejectedValue(dbError)

      // Act & Assert
      await expect(repository.create(microserviceName)).rejects.toThrow(
        'Database connection failed'
      )
      expect(createSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: microserviceName.id,
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: microserviceName.props.createdAt,
        updatedAt: microserviceName.props.updatedAt
      }

      const mapperError = new Error('Mapping failed')
      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(repository.create(microserviceName)).rejects.toThrow(
        'Mapping failed'
      )
      expect(createSpy).toHaveBeenCalledTimes(1)
      expect(fromPrimitivesSpy).toHaveBeenCalledTimes(1)
    })

    it('should pass correct data structure to prisma', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: microserviceName.id,
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: microserviceName.props.createdAt,
        updatedAt: microserviceName.props.updatedAt
      }

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(microserviceName)

      // Act
      await repository.create(microserviceName)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          name: 'Test MicroserviceName',
          description: 'Test Description',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    })

    it('should return mapped entity from mapper', async () => {
      // Arrange
      const microserviceName = MicroserviceNameEntity.create({
        name: 'Test MicroserviceName',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: microserviceName.id,
        name: 'Test MicroserviceName',
        description: 'Test Description',
        createdAt: microserviceName.props.createdAt,
        updatedAt: microserviceName.props.updatedAt
      }

      const expectedMappedEntity = MicroserviceNameEntity.create({
        name: 'Mapped MicroserviceName',
        description: 'Mapped Description'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(expectedMappedEntity)

      // Act
      const result = await repository.create(microserviceName)

      // Assert
      expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockCreatedData)
      expect(result).toBe(expectedMappedEntity)
    })
  })
})
