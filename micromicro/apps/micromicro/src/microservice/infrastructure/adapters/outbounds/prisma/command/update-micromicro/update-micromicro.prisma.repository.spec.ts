import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { UpdateMicromicroPrismaRepository } from './update-micromicro.prisma.repository'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('UpdateMicromicroPrismaRepository', () => {
  let repository: UpdateMicromicroPrismaRepository
  let updateSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      micromicro: {
        update: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMicromicroPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get(UpdateMicromicroPrismaRepository)
    updateSpy = mockPrismaService.micromicro.update
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update micromicro with correct data', async () => {
    const micromicro = MicromicroEntity.create({
      name: 'Test Micromicro',
      description: 'Test Description'
    })
    updateSpy.mockResolvedValue(undefined)
    await repository.update(micromicro)
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: micromicro.id },
      data: {
        name: micromicro.props.name.value,
        description: micromicro.props.description?.value ?? null,
        updatedAt: micromicro.props.updatedAt
      }
    })
  })

  it('should propagate errors from prisma', async () => {
    const micromicro = MicromicroEntity.create({
      name: 'Test Micromicro',
      description: 'Test Description'
    })
    const error = new Error('DB error')
    updateSpy.mockRejectedValue(error)
    await expect(repository.update(micromicro)).rejects.toThrow(
      'DB error'
    )
  })
})
