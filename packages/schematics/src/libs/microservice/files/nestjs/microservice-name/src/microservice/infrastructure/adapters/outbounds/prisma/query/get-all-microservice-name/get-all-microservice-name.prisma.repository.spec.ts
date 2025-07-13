import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { GetAllMicroserviceNamePrismaRepository } from './get-all-microserviceName.prisma.repository'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetAllMicroserviceNamePrismaRepository', () => {
  let repository: GetAllMicroserviceNamePrismaRepository
  let findManySpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      microserviceName: {
        findMany: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMicroserviceNamePrismaRepository,
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

    repository = module.get(GetAllMicroserviceNamePrismaRepository)
    findManySpy = mockPrismaService.microserviceName.findMany
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get all microserviceName successfully', async () => {
    // Arrange
    const mockResults = [
      {
        id: '1',
        name: 'MicroserviceName 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'MicroserviceName 2',
        description: 'Descripción 2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockEntities = [
      MicroserviceNameEntity.create({
        name: 'MicroserviceName 1',
        description: 'Descripción 1'
      }),
      MicroserviceNameEntity.create({
        name: 'MicroserviceName 2',
        description: 'Descripción 2'
      })
    ]

    findManySpy.mockResolvedValue(mockResults)
    fromPrimitivesSpy
      .mockReturnValueOnce(mockEntities[0])
      .mockReturnValueOnce(mockEntities[1])

    // Act
    const result = await repository.getAll()

    // Assert
    expect(findManySpy).toHaveBeenCalledWith()
    expect(fromPrimitivesSpy).toHaveBeenCalledTimes(2)
    expect(fromPrimitivesSpy).toHaveBeenNthCalledWith(1, mockResults[0])
    expect(fromPrimitivesSpy).toHaveBeenNthCalledWith(2, mockResults[1])
    expect(result).toEqual(mockEntities)
  })

  it('should return empty array when no microserviceName exist', async () => {
    // Arrange
    findManySpy.mockResolvedValue([])

    // Act
    const result = await repository.getAll()

    // Assert
    expect(findManySpy).toHaveBeenCalledWith()
    expect(fromPrimitivesSpy).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('should handle database errors', async () => {
    // Arrange
    const dbError = new Error('Database connection failed')
    findManySpy.mockRejectedValue(dbError)

    // Act & Assert
    await expect(repository.getAll()).rejects.toThrow(
      'Database connection failed'
    )
    expect(findManySpy).toHaveBeenCalledTimes(1)
  })

  it('should handle mapper errors', async () => {
    // Arrange
    const mockResults = [
      {
        id: '1',
        name: 'MicroserviceName 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mapperError = new Error('Mapping failed')
    findManySpy.mockResolvedValue(mockResults)
    fromPrimitivesSpy.mockImplementation(() => {
      throw mapperError
    })

    // Act & Assert
    await expect(repository.getAll()).rejects.toThrow('Mapping failed')
    expect(findManySpy).toHaveBeenCalledTimes(1)
    expect(fromPrimitivesSpy).toHaveBeenCalledTimes(1)
  })
})
