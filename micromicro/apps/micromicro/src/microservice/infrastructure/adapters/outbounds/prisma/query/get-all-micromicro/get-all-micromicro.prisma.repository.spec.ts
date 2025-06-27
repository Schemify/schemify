import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { GetAllMicromicroPrismaRepository } from './get-all-micromicro.prisma.repository'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('GetAllMicromicroPrismaRepository', () => {
  let repository: GetAllMicromicroPrismaRepository
  let findManySpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      micromicro: {
        findMany: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMicromicroPrismaRepository,
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

    repository = module.get(GetAllMicromicroPrismaRepository)
    findManySpy = mockPrismaService.micromicro.findMany
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get all micromicro successfully', async () => {
    // Arrange
    const mockResults = [
      {
        id: '1',
        name: 'Micromicro 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Micromicro 2',
        description: 'Descripción 2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockEntities = [
      MicromicroEntity.create({
        name: 'Micromicro 1',
        description: 'Descripción 1'
      }),
      MicromicroEntity.create({
        name: 'Micromicro 2',
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

  it('should return empty array when no micromicro exist', async () => {
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
        name: 'Micromicro 1',
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
