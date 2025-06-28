import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { Get__project_name_pascal__ByIdPrismaRepository } from './get-__project_name_camel__-by-id.prisma.repository'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Get__project_name_pascal__ByIdPrismaRepository', () => {
  let repository: Get__project_name_pascal__ByIdPrismaRepository
  let findUniqueSpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      __project_name_camel__: {
        findUnique: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Get__project_name_pascal__ByIdPrismaRepository,
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

    repository = module.get(Get__project_name_pascal__ByIdPrismaRepository)
    findUniqueSpy = mockPrismaService.__project_name_camel__.findUnique
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get __project_name_camel__ by id successfully', async () => {
    // Arrange
    const mockResult = {
      id: 'test-id',
      name: 'Test __project_name_pascal__',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const mockEntity = __project_name_pascal__Entity.create({
      name: 'Test __project_name_pascal__',
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

  it('should return null when __project_name_camel__ not found', async () => {
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
      name: 'Test __project_name_pascal__',
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
