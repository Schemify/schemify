/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { DeleteMicromicroHandler } from './delete-micromicro.handler'
import { DeleteMicromicroCommand } from './delete-micromicro.command'
import { DeleteMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'
import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { NotFoundException } from '@nestjs/common'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

describe('DeleteMicromicroHandler', () => {
  let handler: DeleteMicromicroHandler
  let deletePort: jest.Mocked<DeleteMicromicroPort>
  let getByIdPort: jest.Mocked<GetMicromicroByIdPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMicromicroHandler,
        {
          provide: DeleteMicromicroPort,
          useValue: { delete: jest.fn() }
        },
        {
          provide: GetMicromicroByIdPort,
          useValue: { getById: jest.fn() }
        }
      ]
    }).compile()

    handler = module.get(DeleteMicromicroHandler)
    deletePort = module.get(DeleteMicromicroPort)
    getByIdPort = module.get(GetMicromicroByIdPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should delete micromicro when it exists', async () => {
      // Arrange
      const micromicroId = 'micromicro-123'
      const existingEntity = MicromicroEntity.create({
        name: 'Micromicro a Eliminar',
        description: 'Descripción del micromicro'
      })

      // Override the id to match our test case
      Object.defineProperty(existingEntity, 'id', {
        value: micromicroId
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      deletePort.delete.mockResolvedValue(undefined)

      const command = new DeleteMicromicroCommand(
        micromicroId
      )

      // Act
      await handler.execute(command)

      // Assert
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(micromicroId)
      expect(deletePort.delete).toHaveBeenCalledTimes(1)
      expect(deletePort.delete).toHaveBeenCalledWith(micromicroId)
    })

    it('should throw NotFoundException when micromicro does not exist', async () => {
      // Arrange
      const nonExistentId = 'micromicro-no-existe'
      getByIdPort.getById.mockResolvedValue(null)

      const command = new DeleteMicromicroCommand(nonExistentId)

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(nonExistentId)
      expect(deletePort.delete).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during getById', async () => {
      // Arrange
      const micromicroId = 'micromicro-error'
      const repositoryError = new Error('Database connection failed')
      getByIdPort.getById.mockRejectedValue(repositoryError)

      const command = new DeleteMicromicroCommand(
        micromicroId
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection failed'
      )
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(deletePort.delete).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during delete', async () => {
      // Arrange
      const micromicroId = 'micromicro-123'
      const existingEntity = MicromicroEntity.create({
        name: 'Micromicro a Eliminar',
        description: 'Descripción del micromicro'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: micromicroId
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      const deleteError = new Error('Delete operation failed')
      deletePort.delete.mockRejectedValue(deleteError)

      const command = new DeleteMicromicroCommand(
        micromicroId
      )

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Delete operation failed'
      )
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(deletePort.delete).toHaveBeenCalledTimes(1)
    })
  })
})
