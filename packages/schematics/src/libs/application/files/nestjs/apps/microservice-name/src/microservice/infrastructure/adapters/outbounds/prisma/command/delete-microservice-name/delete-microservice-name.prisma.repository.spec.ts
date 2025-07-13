import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { DeleteMicroserviceNamePrismaRepository } from './deletemicroservice-name.prisma.repository'

describe('DeleteMicroserviceNamePrismaRepository', () => {
  let repository: DeleteMicroserviceNamePrismaRepository
  let deleteSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      microserviceName: {
        delete: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMicroserviceNamePrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get(DeleteMicroserviceNamePrismaRepository)
    deleteSpy = mockPrismaService.microserviceName.delete
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should delete microserviceName by id', async () => {
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
