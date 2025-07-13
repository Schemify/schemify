/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Create__project_name_camel__Handler } from './create__project_name_kebab__.handler'
import { Create__project_name_camel__Command } from './create__project_name_kebab__.command'
import { Create__project_name_camel__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'
import { __project_name_camel__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'
import { EventPublisher } from '@nestjs/cqrs'

describe('Create__project_name_camel__Handler', () => {
  let handler: Create__project_name_camel__Handler
  let create__project_name_camel__Port: jest.Mocked<Create__project_name_camel__Port>
  let eventPublisher: jest.Mocked<EventPublisher>
  let mockCommit: jest.Mock

  beforeEach(async () => {
    mockCommit = jest.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Create__project_name_camel__Handler,
        {
          provide: Create__project_name_camel__Port,
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

    handler = module.get(Create__project_name_camel__Handler)
    create__project_name_camel__Port = module.get(
      Create__project_name_camel__Port
    )
    eventPublisher = module.get(EventPublisher)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('execute', () => {
    it('should create and save a new __project_name_camel__ successfully', async () => {
      // Arrange
      const command = new Create__project_name_camel__Command(
        '__project_name_camel__ Test',
        'Descripción del __project_name_camel__'
      )
      const mockEntity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Test',
        description: 'Descripción del __project_name_camel__'
      })
      create__project_name_camel__Port.create.mockResolvedValue(mockEntity)

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBeInstanceOf(__project_name_camel__Entity)
      expect(create__project_name_camel__Port.create).toHaveBeenCalledTimes(1)
      expect(create__project_name_camel__Port.create).toHaveBeenCalledWith(
        expect.objectContaining({
          commit: mockCommit
        })
      )
      expect(eventPublisher.mergeObjectContext).toHaveBeenCalledWith(
        expect.any(__project_name_camel__Entity)
      )
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('should throw error when invalid data is provided', async () => {
      // Arrange
      const invalidCommand = new Create__project_name_camel__Command('', 'desc')

      // Act & Assert
      await expect(handler.execute(invalidCommand)).rejects.toThrow()
      expect(create__project_name_camel__Port.create).not.toHaveBeenCalled()
      expect(eventPublisher.mergeObjectContext).not.toHaveBeenCalled()
      expect(mockCommit).not.toHaveBeenCalled()
    })

    it('should propagate repository errors', async () => {
      // Arrange
      const command = new Create__project_name_camel__Command(
        '__project_name_camel__ OK',
        'desc'
      )
      const repositoryError = new Error('Database connection failed')
      create__project_name_camel__Port.create.mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed'
      )
      expect(create__project_name_camel__Port.create).toHaveBeenCalledTimes(1)
      expect(mockCommit).not.toHaveBeenCalled()
    })

    it('should create __project_name_camel__ without description when not provided', async () => {
      // Arrange
      const command = new Create__project_name_camel__Command(
        '__project_name_camel__ Sin Descripción'
      )
      const mockEntity = __project_name_camel__Entity.create({
        name: '__project_name_camel__ Sin Descripción'
      })
      create__project_name_camel__Port.create.mockResolvedValue(mockEntity)

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBeInstanceOf(__project_name_camel__Entity)
      expect(create__project_name_camel__Port.create).toHaveBeenCalledWith(
        expect.objectContaining({
          commit: mockCommit
        })
      )
    })
  })
})
