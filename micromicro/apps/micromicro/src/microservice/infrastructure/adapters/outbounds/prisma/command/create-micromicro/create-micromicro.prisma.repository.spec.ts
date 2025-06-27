import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { CreateMicromicroPrismaRepository } from './create-micromicro.prisma.repository'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('CreateMicromicroPrismaRepository', () => {
  let repository: CreateMicromicroPrismaRepository
  let createSpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      micromicro: {
        create: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMicromicroPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: MicromicroMapper,
          useValue: mockMapper
        }
      ]
    }).compile()

    repository = module.get<CreateMicromicroPrismaRepository>(
      CreateMicromicroPrismaRepository
    )
    createSpy = mockPrismaService.micromicro.create
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create micromicro successfully', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: micromicro.id,
        name: 'Test Micromicro',
        description: 'Test Description',
        createdAt: micromicro.props.createdAt,
        updatedAt: micromicro.props.updatedAt
      }

      const mockMappedEntity = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(mockMappedEntity)

      // Act
      const result = await repository.create(micromicro)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: micromicro.id,
          name: micromicro.props.name.value,
          description: micromicro.props.description?.value ?? null,
          createdAt: micromicro.props.createdAt,
          updatedAt: micromicro.props.updatedAt
        }
      })

      expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockCreatedData)
      expect(result).toBe(mockMappedEntity)
    })

    it('should handle micromicro without description', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro'
        // No description
      })

      const mockCreatedData = {
        id: micromicro.id,
        name: 'Test Micromicro',
        description: '',
        createdAt: micromicro.props.createdAt,
        updatedAt: micromicro.props.updatedAt
      }

      const mockMappedEntity = MicromicroEntity.create({
        name: 'Test Micromicro'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(mockMappedEntity)

      // Act
      const result = await repository.create(micromicro)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: micromicro.id,
          name: micromicro.props.name.value,
          description: '',
          createdAt: micromicro.props.createdAt,
          updatedAt: micromicro.props.updatedAt
        }
      })

      expect(result).toBe(mockMappedEntity)
    })

    it('should handle database errors', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })

      const dbError = new Error('Database connection failed')
      createSpy.mockRejectedValue(dbError)

      // Act & Assert
      await expect(repository.create(micromicro)).rejects.toThrow(
        'Database connection failed'
      )
      expect(createSpy).toHaveBeenCalledTimes(1)
    })

    it('should handle mapper errors', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: micromicro.id,
        name: 'Test Micromicro',
        description: 'Test Description',
        createdAt: micromicro.props.createdAt,
        updatedAt: micromicro.props.updatedAt
      }

      const mapperError = new Error('Mapping failed')
      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockImplementation(() => {
        throw mapperError
      })

      // Act & Assert
      await expect(repository.create(micromicro)).rejects.toThrow(
        'Mapping failed'
      )
      expect(createSpy).toHaveBeenCalledTimes(1)
      expect(fromPrimitivesSpy).toHaveBeenCalledTimes(1)
    })

    it('should pass correct data structure to prisma', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: micromicro.id,
        name: 'Test Micromicro',
        description: 'Test Description',
        createdAt: micromicro.props.createdAt,
        updatedAt: micromicro.props.updatedAt
      }

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(micromicro)

      // Act
      await repository.create(micromicro)

      // Assert
      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id: expect.any(String),
          name: 'Test Micromicro',
          description: 'Test Description',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      })
    })

    it('should return mapped entity from mapper', async () => {
      // Arrange
      const micromicro = MicromicroEntity.create({
        name: 'Test Micromicro',
        description: 'Test Description'
      })

      const mockCreatedData = {
        id: micromicro.id,
        name: 'Test Micromicro',
        description: 'Test Description',
        createdAt: micromicro.props.createdAt,
        updatedAt: micromicro.props.updatedAt
      }

      const expectedMappedEntity = MicromicroEntity.create({
        name: 'Mapped Micromicro',
        description: 'Mapped Description'
      })

      createSpy.mockResolvedValue(mockCreatedData)
      fromPrimitivesSpy.mockReturnValue(expectedMappedEntity)

      // Act
      const result = await repository.create(micromicro)

      // Assert
      expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockCreatedData)
      expect(result).toBe(expectedMappedEntity)
    })
  })
})
