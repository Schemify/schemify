import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { GetAll__project_name_camel__PrismaRepository } from './get-all__project_name_kebab__.prisma.repository'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'
import { __project_name_camel__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('GetAll__project_name_camel__PrismaRepository', () => {
  let repository: GetAll__project_name_camel__PrismaRepository
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
        GetAll__project_name_camel__PrismaRepository,
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

    repository = module.get(GetAll__project_name_camel__PrismaRepository)
    findManySpy = mockPrismaService.__project_name_camel__.findMany
    fromPrimitivesSpy = mockMapper.fromPrimitives
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get all __project_name_camel__ successfully', async () => {
    // Arrange
    const mockResults = [
      {
        id: '1',
        name: '__project_name_camel__ 1',
        description: 'Descripción 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: '__project_name_camel__ 2',
        description: 'Descripción 2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockEntities = [
      __project_name_camel__Entity.create({
        name: '__project_name_camel__ 1',
        description: 'Descripción 1'
      }),
      __project_name_camel__Entity.create({
        name: '__project_name_camel__ 2',
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

  it('should return empty array when no __project_name_camel__ exist', async () => {
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
        name: '__project_name_camel__ 1',
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
