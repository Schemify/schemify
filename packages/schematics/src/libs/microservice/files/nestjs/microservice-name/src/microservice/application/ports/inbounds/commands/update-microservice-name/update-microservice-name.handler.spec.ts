/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateMicroserviceNameHandler } from './update-microserviceName.handler'
import { UpdateMicroserviceNameCommand } from './update-microserviceName.command'
import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'
import { UpdateMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-command-ports'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'
import { NotFoundException } from '@nestjs/common'

describe('UpdateMicroserviceNameHandler', () => {
  let handler: UpdateMicroserviceNameHandler
  let getByIdPort: jest.Mocked<GetMicroserviceNameByIdPort>
  let updatePort: jest.Mocked<UpdateMicroserviceNamePort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMicroserviceNameHandler,
        {
          provide: GetMicroserviceNameByIdPort,
          useValue: { getById: jest.fn() }
        },
        {
          provide: UpdateMicroserviceNamePort,
          useValue: { update: jest.fn() }
        }
      ]
    }).compile()

    handler = module.get(UpdateMicroserviceNameHandler)
    getByIdPort = module.get(GetMicroserviceNameByIdPort)
    updatePort = module.get(UpdateMicroserviceNamePort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should update microserviceName when it exists', async () => {
      // Arrange
      const microserviceNameId = 'microserviceName-123'
      const existingEntity = MicroserviceNameEntity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })

      // Override the id to match our test case
      Object.defineProperty(existingEntity, 'id', {
        value: microserviceNameId
      })

      // Mock the commit method
      const mockCommit = jest.fn()
      existingEntity.commit = mockCommit

      getByIdPort.getById.mockResolvedValue(existingEntity)
      updatePort.update.mockResolvedValue(undefined)

      const command = new UpdateMicroserviceNameCommand(
        microserviceNameId,
        'Nuevo Nombre',
        'Nueva Descripción'
      )

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBe(existingEntity)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(microserviceNameId)
      expect(updatePort.update).toHaveBeenCalledTimes(1)
      expect(updatePort.update).toHaveBeenCalledWith(existingEntity)
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('should throw NotFoundException when microserviceName does not exist', async () => {
      // Arrange
      const nonExistentId = 'microserviceName-no-existe'
      getByIdPort.getById.mockResolvedValue(null)

      const command = new UpdateMicroserviceNameCommand(
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
      const microserviceNameId = 'microserviceName-123'
      const existingEntity = MicroserviceNameEntity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: microserviceNameId
      })

      // Mock the commit method
      const mockCommit = jest.fn()
      existingEntity.commit = mockCommit

      getByIdPort.getById.mockResolvedValue(existingEntity)
      updatePort.update.mockResolvedValue(undefined)

      const command = new UpdateMicroserviceNameCommand(
        microserviceNameId,
        'Solo Nombre'
      )

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBe(existingEntity)
      expect(getByIdPort.getById).toHaveBeenCalledWith(microserviceNameId)
      expect(updatePort.update).toHaveBeenCalledWith(existingEntity)
      expect(mockCommit).toHaveBeenCalled()
    })

    it('should propagate repository errors during getById', async () => {
      // Arrange
      const microserviceNameId = 'microserviceName-error'
      const repositoryError = new Error('Database connection failed')
      getByIdPort.getById.mockRejectedValue(repositoryError)

      const command = new UpdateMicroserviceNameCommand(
        microserviceNameId,
        'Nuevo Nombre'
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed'
      )
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(updatePort.update).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during update', async () => {
      // Arrange
      const microserviceNameId = 'microserviceName-123'
      const existingEntity = MicroserviceNameEntity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: microserviceNameId
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      const updateError = new Error('Update operation failed')
      updatePort.update.mockRejectedValue(updateError)

      const command = new UpdateMicroserviceNameCommand(
        microserviceNameId,
        'Nuevo Nombre'
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Update operation failed'
      )
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(updatePort.update).toHaveBeenCalledTimes(1)
    })
  })
})
