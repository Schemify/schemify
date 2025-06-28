import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { Get__project_name_pascal__WithCursorPrismaRepository } from './get-__project_name_camel__-with-cursor.prisma.repository'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Get__project_name_pascal__WithCursorPrismaRepository', () => {
  let repository: Get__project_name_pascal__WithCursorPrismaRepository
  let findManySpy: jest.Mock
  let fromPrimitivesSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      __project_name_camel__: {
        findMany: jest.fn()
      }
    }

    const mockMapper = {
      fromPrimitives: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Get__project_name_pascal__WithCursorPrismaRepository,
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

    repository = module.get(
      Get__project_name_pascal__WithCursorPrismaRepository
    )
    findManySpy = mockPrismaService.__project_name_camel__.findMany
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get __project_name_camel__ with cursor successfully', async () => {
    // Arrange
    const mockResults = [
      {
        id: '1',
        name: '__project_name_pascal__ 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: '__project_name_pascal__ 2',
        description: 'Descripción 2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockEntities = [
      __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ 1',
        description: 'Descripción 1'
      }),
      __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ 2',
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
        name: '__project_name_pascal__ 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockEntity = __project_name_pascal__Entity.create({
      name: '__project_name_pascal__ 1',
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
        name: '__project_name_pascal__ 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: '__project_name_pascal__ 2',
        description: 'Descripción 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: '__project_name_pascal__ 3',
        description: 'Descripción 3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockEntities = [
      __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ 1',
        description: 'Descripción 1'
      }),
      __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ 2',
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

  it('should return empty result when no __project_name_camel__ exist', async () => {
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
        name: '__project_name_pascal__ 1',
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
