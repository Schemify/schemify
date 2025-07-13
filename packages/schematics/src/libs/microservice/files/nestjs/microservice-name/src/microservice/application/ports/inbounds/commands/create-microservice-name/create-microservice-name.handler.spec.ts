/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { CreateMicroserviceNameHandler } from './create-microserviceName.handler'
import { CreateMicroserviceNameCommand } from './create-microserviceName.command'
import { CreateMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-command-ports'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'
import { EventPublisher } from '@nestjs/cqrs'

describe('CreateMicroserviceNameHandler', () => {
  let handler: CreateMicroserviceNameHandler
  let createMicroserviceNamePort: jest.Mocked<CreateMicroserviceNamePort>
  let eventPublisher: jest.Mocked<EventPublisher>
  let mockCommit: jest.Mock

  beforeEach(async () => {
    mockCommit = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMicroserviceNameHandler,
        {
          provide: CreateMicroserviceNamePort,
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

    handler = module.get(CreateMicroserviceNameHandler)
    createMicroserviceNamePort = module.get(
      CreateMicroserviceNamePort
    )
    eventPublisher = module.get(EventPublisher)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('execute', () => {
    it('should create and save a new microserviceName successfully', async () => {
      // Arrange
      const command = new CreateMicroserviceNameCommand(
        'MicroserviceName Test',
        'Descripción del microserviceName'
      )
      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Test',
        description: 'Descripción del microserviceName'
      })
      createMicroserviceNamePort.create.mockResolvedValue(mockEntity)

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBeInstanceOf(MicroserviceNameEntity)
      expect(createMicroserviceNamePort.create).toHaveBeenCalledTimes(1)
      expect(createMicroserviceNamePort.create).toHaveBeenCalledWith(
        expect.objectContaining({
          commit: mockCommit
        })
      )
      expect(eventPublisher.mergeObjectContext).toHaveBeenCalledWith(
        expect.any(MicroserviceNameEntity)
      )
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('should throw error when invalid data is provided', async () => {
      // Arrange
      const invalidCommand = new CreateMicroserviceNameCommand(
        '',
        'desc'
      )

      // Act & Assert
      await expect(handler.execute(invalidCommand)).rejects.toThrow()
      expect(createMicroserviceNamePort.create).not.toHaveBeenCalled()
      expect(eventPublisher.mergeObjectContext).not.toHaveBeenCalled()
      expect(mockCommit).not.toHaveBeenCalled()
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const command = new CreateMicroserviceNameCommand(
        'MicroserviceName OK',
        'desc'
      )
      const repositoryError = new Error('Database connection failed')
      createMicroserviceNamePort.create.mockRejectedValue(
        repositoryError
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed'
      )
      expect(createMicroserviceNamePort.create).toHaveBeenCalledTimes(1)
      expect(mockCommit).not.toHaveBeenCalled()
    })

    it('should create microserviceName without description when not provided', async () => {
      // Arrange
      const command = new CreateMicroserviceNameCommand(
        'MicroserviceName Sin Descripción'
      )
      const mockEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName Sin Descripción'
      })
      createMicroserviceNamePort.create.mockResolvedValue(mockEntity)

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBeInstanceOf(MicroserviceNameEntity)
      expect(createMicroserviceNamePort.create).toHaveBeenCalledWith(
        expect.objectContaining({
          commit: mockCommit
        })
      )
    })
  })
})
