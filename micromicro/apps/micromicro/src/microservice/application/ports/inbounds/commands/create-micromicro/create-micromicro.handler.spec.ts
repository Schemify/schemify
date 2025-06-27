/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { CreateMicromicroHandler } from './create-micromicro.handler'
import { CreateMicromicroCommand } from './create-micromicro.command'
import { CreateMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'
import { EventPublisher } from '@nestjs/cqrs'

describe('CreateMicromicroHandler', () => {
  let handler: CreateMicromicroHandler
  let createMicromicroPort: jest.Mocked<CreateMicromicroPort>
  let eventPublisher: jest.Mocked<EventPublisher>
  let mockCommit: jest.Mock

  beforeEach(async () => {
    mockCommit = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMicromicroHandler,
        {
          provide: CreateMicromicroPort,
          useValue: {
            create: jest.fn()
          }
        },
        {
          provide: EventPublisher,
          useValue: {
            mergeObjectContext: jest.fn((entity) => ({
              ...entity,
              commit: mockCommit
            }))
          }
        }
      ]
    }).compile()

    handler = module.get(CreateMicromicroHandler)
    createMicromicroPort = module.get(
      CreateMicromicroPort
    )
    eventPublisher = module.get(EventPublisher)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('execute', () => {
    it('should create and save a new micromicro successfully', async () => {
      // Arrange
      const command = new CreateMicromicroCommand(
        'Micromicro Test',
        'Descripción del micromicro'
      )
      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Test',
        description: 'Descripción del micromicro'
      })
      createMicromicroPort.create.mockResolvedValue(mockEntity)

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBeInstanceOf(MicromicroEntity)
      expect(createMicromicroPort.create).toHaveBeenCalledTimes(1)
      expect(createMicromicroPort.create).toHaveBeenCalledWith(
        expect.objectContaining({
          commit: mockCommit
        })
      )
      expect(eventPublisher.mergeObjectContext).toHaveBeenCalledWith(
        expect.any(MicromicroEntity)
      )
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('should throw error when invalid data is provided', async () => {
      // Arrange
      const invalidCommand = new CreateMicromicroCommand(
        '',
        'desc'
      )

      // Act & Assert
      await expect(handler.execute(invalidCommand)).rejects.toThrow()
      expect(createMicromicroPort.create).not.toHaveBeenCalled()
      expect(eventPublisher.mergeObjectContext).not.toHaveBeenCalled()
      expect(mockCommit).not.toHaveBeenCalled()
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const command = new CreateMicromicroCommand(
        'Micromicro OK',
        'desc'
      )
      const repositoryError = new Error('Database connection failed')
      createMicromicroPort.create.mockRejectedValue(
        repositoryError
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed'
      )
      expect(createMicromicroPort.create).toHaveBeenCalledTimes(1)
      expect(mockCommit).not.toHaveBeenCalled()
    })

    it('should create micromicro without description when not provided', async () => {
      // Arrange
      const command = new CreateMicromicroCommand(
        'Micromicro Sin Descripción'
      )
      const mockEntity = MicromicroEntity.create({
        name: 'Micromicro Sin Descripción'
      })
      createMicromicroPort.create.mockResolvedValue(mockEntity)

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBeInstanceOf(MicromicroEntity)
      expect(createMicromicroPort.create).toHaveBeenCalledWith(
        expect.objectContaining({
          commit: mockCommit
        })
      )
    })
  })
})
