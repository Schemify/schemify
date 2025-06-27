/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateMicromicroHandler } from './update-micromicro.handler'
import { UpdateMicromicroCommand } from './update-micromicro.command'
import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { UpdateMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'
import { NotFoundException } from '@nestjs/common'

describe('UpdateMicromicroHandler', () => {
  let handler: UpdateMicromicroHandler
  let getByIdPort: jest.Mocked<GetMicromicroByIdPort>
  let updatePort: jest.Mocked<UpdateMicromicroPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMicromicroHandler,
        {
          provide: GetMicromicroByIdPort,
          useValue: { getById: jest.fn() }
        },
        {
          provide: UpdateMicromicroPort,
          useValue: { update: jest.fn() }
        }
      ]
    }).compile()

    handler = module.get(UpdateMicromicroHandler)
    getByIdPort = module.get(GetMicromicroByIdPort)
    updatePort = module.get(UpdateMicromicroPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should update micromicro when it exists', async () => {
      // Arrange
      const micromicroId = 'micromicro-123'
      const existingEntity = MicromicroEntity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })

      // Override the id to match our test case
      Object.defineProperty(existingEntity, 'id', {
        value: micromicroId
      })

      // Mock the commit method
      const mockCommit = jest.fn()
      existingEntity.commit = mockCommit

      getByIdPort.getById.mockResolvedValue(existingEntity)
      updatePort.update.mockResolvedValue(undefined)

      const command = new UpdateMicromicroCommand(
        micromicroId,
        'Nuevo Nombre',
        'Nueva Descripción'
      )

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBe(existingEntity)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(micromicroId)
      expect(updatePort.update).toHaveBeenCalledTimes(1)
      expect(updatePort.update).toHaveBeenCalledWith(existingEntity)
      expect(mockCommit).toHaveBeenCalledTimes(1)
    })

    it('should throw NotFoundException when micromicro does not exist', async () => {
      // Arrange
      const nonExistentId = 'micromicro-no-existe'
      getByIdPort.getById.mockResolvedValue(null)

      const command = new UpdateMicromicroCommand(
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
      const micromicroId = 'micromicro-123'
      const existingEntity = MicromicroEntity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: micromicroId
      })

      // Mock the commit method
      const mockCommit = jest.fn()
      existingEntity.commit = mockCommit

      getByIdPort.getById.mockResolvedValue(existingEntity)
      updatePort.update.mockResolvedValue(undefined)

      const command = new UpdateMicromicroCommand(
        micromicroId,
        'Solo Nombre'
      )

      // Act
      const result = await handler.execute(command)

      // Assert
      expect(result).toBe(existingEntity)
      expect(getByIdPort.getById).toHaveBeenCalledWith(micromicroId)
      expect(updatePort.update).toHaveBeenCalledWith(existingEntity)
      expect(mockCommit).toHaveBeenCalled()
    })

    it('should propagate repository errors during getById', async () => {
      // Arrange
      const micromicroId = 'micromicro-error'
      const repositoryError = new Error('Database connection failed')
      getByIdPort.getById.mockRejectedValue(repositoryError)

      const command = new UpdateMicromicroCommand(
        micromicroId,
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
      const micromicroId = 'micromicro-123'
      const existingEntity = MicromicroEntity.create({
        name: 'Nombre Original',
        description: 'Descripción Original'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: micromicroId
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      const updateError = new Error('Update operation failed')
      updatePort.update.mockRejectedValue(updateError)

      const command = new UpdateMicromicroCommand(
        micromicroId,
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
