/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing'
import { Delete__project_name_pascal__Handler } from './delete-__project_name_camel__.handler'
import { Delete__project_name_pascal__Command } from './delete-__project_name_camel__.command'
import { Delete__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-command-ports'
import { Get__project_name_pascal__ByIdPort } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-query-ports'
import { NotFoundException } from '@nestjs/common'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

describe('Delete__project_name_pascal__Handler', () => {
  let handler: Delete__project_name_pascal__Handler
  let deletePort: jest.Mocked<Delete__project_name_pascal__Port>
  let getByIdPort: jest.Mocked<Get__project_name_pascal__ByIdPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Delete__project_name_pascal__Handler,
        {
          provide: Delete__project_name_pascal__Port,
          useValue: { delete: jest.fn() }
        },
        {
          provide: Get__project_name_pascal__ByIdPort,
          useValue: { getById: jest.fn() }
        }
      ]
    }).compile()

    handler = module.get(Delete__project_name_pascal__Handler)
    deletePort = module.get(Delete__project_name_pascal__Port)
    getByIdPort = module.get(Get__project_name_pascal__ByIdPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should delete __project_name_camel__ when it exists', async () => {
      // Arrange
      const __project_name_camel__Id = '__project_name_camel__-123'
      const existingEntity = __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ a Eliminar',
        description: 'Descripción del __project_name_camel__'
      })

      // Override the id to match our test case
      Object.defineProperty(existingEntity, 'id', {
        value: __project_name_camel__Id
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      deletePort.delete.mockResolvedValue(undefined)

      const command = new Delete__project_name_pascal__Command(
        __project_name_camel__Id
      )

      // Act
      await handler.execute(command)

      // Assert
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(__project_name_camel__Id)
      expect(deletePort.delete).toHaveBeenCalledTimes(1)
      expect(deletePort.delete).toHaveBeenCalledWith(__project_name_camel__Id)
    })

    it('should throw NotFoundException when __project_name_camel__ does not exist', async () => {
      // Arrange
      const nonExistentId = '__project_name_camel__-no-existe'
      getByIdPort.getById.mockResolvedValue(null)

      const command = new Delete__project_name_pascal__Command(nonExistentId)

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
      expect(getByIdPort.getById).toHaveBeenCalledTimes(1)
      expect(getByIdPort.getById).toHaveBeenCalledWith(nonExistentId)
      expect(deletePort.delete).not.toHaveBeenCalled()
    })

    it('should propagate repository errors during getById', async () => {
      // Arrange
      const __project_name_camel__Id = '__project_name_camel__-error'
      const repositoryError = new Error('Database connection failed')
      getByIdPort.getById.mockRejectedValue(repositoryError)

      const command = new Delete__project_name_pascal__Command(
        __project_name_camel__Id
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
      const __project_name_camel__Id = '__project_name_camel__-123'
      const existingEntity = __project_name_pascal__Entity.create({
        name: '__project_name_pascal__ a Eliminar',
        description: 'Descripción del __project_name_camel__'
      })
      Object.defineProperty(existingEntity, 'id', {
        value: __project_name_camel__Id
      })

      getByIdPort.getById.mockResolvedValue(existingEntity)
      const deleteError = new Error('Delete operation failed')
      deletePort.delete.mockRejectedValue(deleteError)

      const command = new Delete__project_name_pascal__Command(
        __project_name_camel__Id
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
