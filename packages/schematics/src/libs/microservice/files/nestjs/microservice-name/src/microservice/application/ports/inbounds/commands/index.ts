/**
 * Punto de entrada para la capa de **commands** (CQRS).
 *
 * Este archivo exporta:
 * - Todos los comandos (`*.command.ts`) de forma centralizada
 * - El array `CommandHandlers` para registrar en el `CommandBus` de NestJS
 *
 * Esto permite:
 * ✅ Facilitar el registro en los módulos (`@Module.providers`)
 * ✅ Reutilizar los comandos desde cualquier parte del sistema
 * ✅ Mantener una estructura limpia, desacoplada y estandarizada
 *
 * Ejemplo de uso en un módulo:
 *
 * ```ts
 * import { CommandHandlers } from './application/commands'
 *
 * @Module({
 *   providers: [...CommandHandlers],
 * })
 * export class MicroserviceNameModule {}
 * ```
 */

// 📦 Array con todos los Command Handlers
import { CreateMicroserviceNameHandler } from './create-microserviceName/create-microserviceName.handler'
import { UpdateMicroserviceNameHandler } from './update-microserviceName/update-microserviceName.handler'
import { DeleteMicroserviceNameHandler } from './delete-microserviceName/delete-microserviceName.handler'

/**
 * Handlers a registrar en el CommandBus
 */
export const CommandHandlers = [
  CreateMicroserviceNameHandler,
  UpdateMicroserviceNameHandler,
  DeleteMicroserviceNameHandler
]

// 📤 Reexportación directa de los comandos para facilitar imports individuales
export * from './create-microserviceName/create-microserviceName.command'
export * from './update-microserviceName/update-microserviceName.command'
export * from './delete-microserviceName/delete-microserviceName.command'
