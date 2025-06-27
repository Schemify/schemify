import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { DeleteMicromicroPrismaRepository } from './delete-micromicro.prisma.repository'

describe('DeleteMicromicroPrismaRepository', () => {
  let repository: DeleteMicromicroPrismaRepository
  let deleteSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      micromicro: {
        delete: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMicromicroPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get(DeleteMicromicroPrismaRepository)
    deleteSpy = mockPrismaService.micromicro.delete
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should delete micromicro by id', async () => {
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
