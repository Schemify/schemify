import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { Update__project_name_camel__PrismaRepository } from './update__project_name_kebab__.prisma.repository'
import { __project_name_camel__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Update__project_name_camel__PrismaRepository', () => {
  let repository: Update__project_name_camel__PrismaRepository
  let updateSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      __project_name_camel__: {
        update: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Update__project_name_camel__PrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get(Update__project_name_camel__PrismaRepository)
    updateSpy = mockPrismaService.__project_name_camel__.update
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update __project_name_camel__ with correct data', async () => {
    const __project_name_camel__ = __project_name_camel__Entity.create({
      name: 'Test __project_name_camel__',
      description: 'Test Description'
    })
    updateSpy.mockResolvedValue(undefined)
    await repository.update(__project_name_camel__)
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: __project_name_camel__.id },
      data: {
        name: __project_name_camel__.props.name.value,
        description: __project_name_camel__.props.description?.value ?? null,
        updatedAt: __project_name_camel__.props.updatedAt
      }
    })
  })

  it('should propagate errors from prisma', async () => {
    const __project_name_camel__ = __project_name_camel__Entity.create({
      name: 'Test __project_name_camel__',
      description: 'Test Description'
    })
    const error = new Error('DB error')
    updateSpy.mockRejectedValue(error)
    await expect(repository.update(__project_name_camel__)).rejects.toThrow(
      'DB error'
    )
  })
})
