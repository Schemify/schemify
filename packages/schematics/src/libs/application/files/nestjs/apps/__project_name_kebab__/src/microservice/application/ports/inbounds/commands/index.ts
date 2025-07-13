// 📦 Array con todos los Command Handlers
import { Create__project_name_camel__Handler } from './create-__project_name_kebab__/create-__project_name_kebab__.handler'
import { Update__project_name_camel__Handler } from './update-__project_name_kebab__/update-__project_name_kebab__.handler'
import { Delete__project_name_camel__Handler } from './delete-__project_name_kebab__/delete-__project_name_kebab__.handler'

/**
 * Handlers a registrar en el CommandBus
 */
export const CommandHandlers = [
  Create__project_name_camel__Handler,
  Update__project_name_camel__Handler,
  Delete__project_name_camel__Handler
]

// 📤 Reexportación directa de los comandos para facilitar imports individuales
export * from './create-__project_name_kebab__/create-__project_name_kebab__.command'
export * from './update-__project_name_kebab__/update-__project_name_kebab__.command'
export * from './delete-__project_name_kebab__/delete-__project_name_kebab__.command'
