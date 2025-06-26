/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Update__project_name_pascal__Handler } from './update-__project_name_kebab__.handler'
import { Update__project_name_pascal__Command } from './update-__project_name_kebab__.command'
import { Get__project_name_pascal__ByIdPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { Update__project_name_pascal__Port } from '@__project_name_kebab__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'
import { __project_name_pascal__Entity } from '@__project_name_kebab__/microservice/domain/entities/__project_name_kebab__.entity'
import { NotFoundException } from '@nestjs/common'

describe('Update__project_name_pascal__Handler', () => {
  let handler: Update__project_name_pascal__Handler
  let getByIdPort: jest.Mocked<Get__project_name_pascal__ByIdPort>
  let updatePort: jest.Mocked<Update__project_name_pascal__Port>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Update__project_name_pascal__Handler,
        {
          provide: Get__project_name_pascal__ByIdPort,
          useValue: { getById: jest.fn() }
        },
        {
          provide: Update__project_name_pascal__Port,
          useValue: { update: jest.fn() }
        }
      ]
    }).compile()

    handler = module.get(Update__project_name_pascal__Handler)
    getByIdPort = module.get(Get__project_name_pascal__ByIdPort)
    updatePort = module.get(Update__project_name_pascal__Port)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should update client when it exists', async () => {
      // Arrange
      const clientId = 'cliente-123'
      const existingEntity = __project_name_pascal__Entity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })

      // Override the id to match our test case
      Object.defineProperty(existingEntity, 'id', { value: clientId })

      // Mock the commit method
      const mockCommit = jest.fn()
      existingEntity.commit = mockCommit

      getByIdPort.getById.mockResolvedValue(existingEntity)
      updatePort.update.mockResolvedValue(undefined)

      const command = new Update__project_name_pascal__Command(
        clientId,
        'Nuevo Nombre',
        'Nueva Descripción'
      )

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBe(existingEntity)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(clientId)
      expect(updatePort.update).toHaveBeenCalledTimes(1)
      expect(updatePort.update).toHaveBeenCalledWith(existingEntity)
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('should throw NotFoundException when client does not exist', async () => {
      // Arrange
      const nonExistentId = 'cliente-no-existe'
      getByIdPort.getById.mockResolvedValue(null)

      const command = new Update__project_name_pascal__Command(
        nonExistentId,
        'Nuevo Nombre',
        'Nueva Descripción'
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(nonExistentId)
      expect(updatePort.update).not.toHaveBeenCalled()
    })

    it('should update only name when description is not provided', async () => {
      // Arrange
      const clientId = 'cliente-123'
      const existingEntity = __project_name_pascal__Entity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })
      Object.defineProperty(existingEntity, 'id', { value: clientId })

      // Mock the commit method
      const mockCommit = jest.fn()
      existingEntity.commit = mockCommit

      getByIdPort.getById.mockResolvedValue(existingEntity)
      updatePort.update.mockResolvedValue(undefined)

      const command = new Update__project_name_pascal__Command(clientId, 'Solo Nombre')

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBe(existingEntity)
      expect(getByIdPort.getById).toHaveBeenCalledWith(clientId)
      expect(updatePort.update).toHaveBeenCalledWith(existingEntity)
      expect(mockCommit).toHaveBeenCalled()
    })

    it('should propagate repository errors during getById', async () => {
      // Arrange
      const clientId = 'cliente-error'
      const repositoryError = new Error('Database connection failed')
      getByIdPort.getById.mockRejectedValue(repositoryError)

      const command = new Update__project_name_pascal__Command(clientId, 'Nuevo Nombre')

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed'
      )
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(updatePort.update).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during update', async () => {
      // Arrange
      const clientId = 'cliente-123'
      const existingEntity = __project_name_pascal__Entity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })
      Object.defineProperty(existingEntity, 'id', { value: clientId })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      const updateError = new Error('Update operation failed')
      updatePort.update.mockRejectedValue(updateError)

      const command = new Update__project_name_pascal__Command(clientId, 'Nuevo Nombre')

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Update operation failed'
      )
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(updatePort.update).toHaveBeenCalledTimes(1)
    })
  })
})
