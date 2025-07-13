import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { Delete__project_name_camel__PrismaRepository } from './delete__project_name_kebab__.prisma.repository'

describe('Delete__project_name_camel__PrismaRepository', () => {
  let repository: Delete__project_name_camel__PrismaRepository
  let deleteSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      __project_name_camel__: {
        delete: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Delete__project_name_camel__PrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get(Delete__project_name_camel__PrismaRepository)
    deleteSpy = mockPrismaService.__project_name_camel__.delete
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should delete __project_name_camel__ by id', async () => {
    deleteSpy.mockResolvedValue(undefined)
    await repository.delete('test-id')
    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: 'test-id' } })
  })

  it('should propagate errors from prisma', async () => {
    const error = new Error('DB error')
    deleteSpy.mockRejectedValue(error)
    await expect(repository.delete('test-id')).rejects.toThrow('DB error')
  })
})
