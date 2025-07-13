// 📦 Array con todos los Command Handlers
import { CreateMicroserviceNameHandler } from './create-microservice-name/create-microservice-name.handler'
import { UpdateMicroserviceNameHandler } from './update-microservice-name/update-microservice-name.handler'
import { DeleteMicroserviceNameHandler } from './delete-microservice-name/delete-microservice-name.handler'

/**
 * Handlers a registrar en el CommandBus
 */
export const CommandHandlers = [
  CreateMicroserviceNameHandler,
  UpdateMicroserviceNameHandler,
  DeleteMicroserviceNameHandler
]

// 📤 Reexportación directa de los comandos para facilitar imports individuales
export * from './create-microservice-name/create-microservice-name.command'
export * from './update-microservice-name/update-microservice-name.command'
export * from './delete-microservice-name/delete-microservice-name.command'
