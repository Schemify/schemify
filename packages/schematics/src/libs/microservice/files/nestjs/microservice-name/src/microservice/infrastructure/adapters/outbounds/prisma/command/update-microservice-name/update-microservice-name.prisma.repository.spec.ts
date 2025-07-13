import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../../prisma.service'
import { UpdateMicroserviceNamePrismaRepository } from './update-microserviceName.prisma.repository'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('UpdateMicroserviceNamePrismaRepository', () => {
  let repository: UpdateMicroserviceNamePrismaRepository
  let updateSpy: jest.Mock

  beforeEach(async () => {
    const mockPrismaService = {
      microserviceName: {
        update: jest.fn()
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMicroserviceNamePrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        }
      ]
    }).compile()

    repository = module.get(UpdateMicroserviceNamePrismaRepository)
    updateSpy = mockPrismaService.microserviceName.update
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update microserviceName with correct data', async () => {
    const microserviceName = MicroserviceNameEntity.create({
      name: 'Test MicroserviceName',
      description: 'Test Description'
    })
    updateSpy.mockResolvedValue(undefined)
    await repository.update(microserviceName)
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: microserviceName.id },
      data: {
        name: microserviceName.props.name.value,
        description: microserviceName.props.description?.value ?? null,
        updatedAt: microserviceName.props.updatedAt
      }
    })
  })

  it('should propagate errors from prisma', async () => {
    const microserviceName = MicroserviceNameEntity.create({
      name: 'Test MicroserviceName',
      description: 'Test Description'
    })
    const error = new Error('DB error')
    updateSpy.mockRejectedValue(error)
    await expect(repository.update(microserviceName)).rejects.toThrow(
      'DB error'
    )
  })
})
