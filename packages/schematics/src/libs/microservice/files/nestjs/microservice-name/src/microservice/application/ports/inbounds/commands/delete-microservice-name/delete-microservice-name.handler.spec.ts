/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { DeleteMicroserviceNameHandler } from './delete-microserviceName.handler'
import { DeleteMicroserviceNameCommand } from './delete-microserviceName.command'
import { DeleteMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-command-ports'
import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'
import { NotFoundException } from '@nestjs/common'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

describe('DeleteMicroserviceNameHandler', () => {
  let handler: DeleteMicroserviceNameHandler
  let deletePort: jest.Mocked<DeleteMicroserviceNamePort>
  let getByIdPort: jest.Mocked<GetMicroserviceNameByIdPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMicroserviceNameHandler,
        {
          provide: DeleteMicroserviceNamePort,
          useValue: { delete: jest.fn() }
        },
        {
          provide: GetMicroserviceNameByIdPort,
          useValue: { getById: jest.fn() }
        }
      ]
    }).compile()

    handler = module.get(DeleteMicroserviceNameHandler)
    deletePort = module.get(DeleteMicroserviceNamePort)
    getByIdPort = module.get(GetMicroserviceNameByIdPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should delete microserviceName when it exists', async () => {
      // Arrange
      const microserviceNameId = 'microserviceName-123'
      const existingEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName a Eliminar',
        description: 'Descripción del microserviceName'
      })

      // Override the id to match our test case
      Object.defineProperty(existingEntity, 'id', {
        value: microserviceNameId
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      deletePort.delete.mockResolvedValue(undefined)

      const command = new DeleteMicroserviceNameCommand(
        microserviceNameId
      )

      // Act
      await handler.execute(command)

      // Assert
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(microserviceNameId)
      expect(deletePort.delete).toHaveBeenCalledTimes(1)
      expect(deletePort.delete).toHaveBeenCalledWith(microserviceNameId)
    })

    it('should throw NotFoundException when microserviceName does not exist', async () => {
      // Arrange
      const nonExistentId = 'microserviceName-no-existe'
      getByIdPort.getById.mockResolvedValue(null)

      const command = new DeleteMicroserviceNameCommand(nonExistentId)

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(nonExistentId)
      expect(deletePort.delete).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during getById', async () => {
      // Arrange
      const microserviceNameId = 'microserviceName-error'
      const repositoryError = new Error('Database connection failed')
      getByIdPort.getById.mockRejectedValue(repositoryError)

      const command = new DeleteMicroserviceNameCommand(
        microserviceNameId
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
      const microserviceNameId = 'microserviceName-123'
      const existingEntity = MicroserviceNameEntity.create({
        name: 'MicroserviceName a Eliminar',
        description: 'Descripción del microserviceName'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: microserviceNameId
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      const deleteError = new Error('Delete operation failed')
      deletePort.delete.mockRejectedValue(deleteError)

      const command = new DeleteMicroserviceNameCommand(
        microserviceNameId
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
