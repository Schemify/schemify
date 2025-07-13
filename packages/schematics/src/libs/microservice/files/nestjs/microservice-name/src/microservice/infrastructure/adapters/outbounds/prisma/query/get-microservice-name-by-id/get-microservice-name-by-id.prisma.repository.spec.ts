import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { GetMicroserviceNameByIdPrismaRepository } from './get-microserviceName-by-id.prisma.repository'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetMicroserviceNameByIdPrismaRepository', () => {
  let repository: GetMicroserviceNameByIdPrismaRepository
  let findUniqueSpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      microserviceName: {
        findUnique: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMicroserviceNameByIdPrismaRepository,
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

    repository = module.get(GetMicroserviceNameByIdPrismaRepository)
    findUniqueSpy = mockPrismaService.microserviceName.findUnique
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get microserviceName by id successfully', async () => {
    // Arrange
    const mockResult = {
      id: 'test-id',
      name: 'Test MicroserviceName',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mockEntity = MicroserviceNameEntity.create({
      name: 'Test MicroserviceName',
      description: 'Test Description'
    })

    findUniqueSpy.mockResolvedValue(mockResult)
    fromPrimitivesSpy.mockReturnValue(mockEntity)

    // Act
    const result = await repository.getById('test-id')

    // Assert
    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: 'test-id' }
    })
    expect(fromPrimitivesSpy).toHaveBeenCalledWith(mockResult)
    expect(result).toBe(mockEntity)
  })

  it('should return null when microserviceName not found', async () => {
    // Arrange
    findUniqueSpy.mockResolvedValue(null)

    // Act
    const result = await repository.getById('non-existent-id')

    // Assert
    expect(findUniqueSpy).toHaveBeenCalledWith({
      where: { id: 'non-existent-id' }
    })
    expect(fromPrimitivesSpy).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should handle database errors', async () => {
    // Arrange
    const dbError = new Error('Database connection failed')
    findUniqueSpy.mockRejectedValue(dbError)

    // Act & Assert
    await expect(repository.getById('test-id')).rejects.toThrow(
      'Database connection failed'
    )
    expect(findUniqueSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle mapper errors', async () => {
    // Arrange
    const mockResult = {
      id: 'test-id',
      name: 'Test MicroserviceName',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mapperError = new Error('Mapping failed')
    findUniqueSpy.mockResolvedValue(mockResult)
    fromPrimitivesSpy.mockImplementation(() => {
      throw mapperError
    })

    // Act & Assert
    await expect(repository.getById('test-id')).rejects.toThrow(
      'Mapping failed'
    )
    expect(findUniqueSpy).toHaveBeenCalledTimes(1)
    expect(fromPrimitivesSpy).toHaveBeenCalledTimes(1)
  })
})
