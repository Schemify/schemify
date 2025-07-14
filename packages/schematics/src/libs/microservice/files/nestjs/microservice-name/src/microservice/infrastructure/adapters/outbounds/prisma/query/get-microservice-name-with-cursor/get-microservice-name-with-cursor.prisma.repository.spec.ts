import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { GetMicroserviceNameWithCursorPrismaRepository } from './get-microserviceName-with-cursor.prisma.repository'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('GetMicroserviceNameWithCursorPrismaRepository', () => {
  let repository: GetMicroserviceNameWithCursorPrismaRepository
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
        GetMicroserviceNameWithCursorPrismaRepository,
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

    repository = module.get(GetMicroserviceNameWithCursorPrismaRepository)
    findManySpy = mockPrismaService.microserviceName.findMany
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get microserviceName with cursor successfully', async () => {
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
    const result = await repository.getWithCursor('0', 2)

    // Assert
    expect(findManySpy).toHaveBeenCalledWith({
      take: 3,
      cursor: { id: '0' },
      skip: 1,
      orderBy: { id: 'asc' }
    })
    expect(fromPrimitivesSpy).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      items: mockEntities,
      nextCursor: '2',
      hasMore: false
    })
  })

  it('should handle first page without cursor', async () => {
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

    const mockEntity = MicroserviceNameEntity.create({
      name: 'MicroserviceName 1',
      description: 'Descripción 1'
    })

    findManySpy.mockResolvedValue(mockResults)
    fromPrimitivesSpy.mockReturnValue(mockEntity)

    // Act
    const result = await repository.getWithCursor('', 1)

    // Assert
    expect(findManySpy).toHaveBeenCalledWith({
      take: 2,
      orderBy: { id: 'asc' }
    })
    expect(result).toEqual({
      items: [mockEntity],
      nextCursor: '1',
      hasMore: false
    })
  })

  it('should indicate hasMore when there are more results', async () => {
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
      },
      {
        id: '3',
        name: 'MicroserviceName 3',
        description: 'Descripción 3',
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
    const result = await repository.getWithCursor('0', 2)

    // Assert
    expect(result).toEqual({
      items: mockEntities,
      nextCursor: '2',
      hasMore: true
    })
  })

  it('should return empty result when no microserviceName exist', async () => {
    // Arrange
    findManySpy.mockResolvedValue([])

    // Act
    const result = await repository.getWithCursor('', 10)

    // Assert
    expect(findManySpy).toHaveBeenCalledWith({
      take: 11,
      orderBy: { id: 'asc' }
    })
    expect(fromPrimitivesSpy).not.toHaveBeenCalled()
    expect(result).toEqual({
      items: [],
      nextCursor: null,
      hasMore: false
    })
  })

  it('should handle database errors', async () => {
    // Arrange
    const dbError = new Error('Database connection failed')
    findManySpy.mockRejectedValue(dbError)

    // Act & Assert
    await expect(repository.getWithCursor('', 10)).rejects.toThrow(
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
    await expect(repository.getWithCursor('', 1)).rejects.toThrow(
      'Mapping failed'
    )
    expect(findManySpy).toHaveBeenCalledTimes(1)
    expect(fromPrimitivesSpy).toHaveBeenCalledTimes(1)
  })
})
