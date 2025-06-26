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
 * export class __ProjectName__Module {}
 * ```
 */

// 📦 Array con todos los Command Handlers
import { Create__ProjectName__Handler } from './create-__projectName__/create-__projectName__.handler'
import { Update__ProjectName__Handler } from './update-__projectName__/update-__projectName__.handler'
import { Delete__ProjectName__Handler } from './delete-__projectName__/delete-__projectName__.handler'

/**
 * Handlers a registrar en el CommandBus
 */
export const CommandHandlers = [
  Create__ProjectName__Handler,
  Update__ProjectName__Handler,
  Delete__ProjectName__Handler
]

// 📤 Reexportación directa de los comandos para facilitar imports individuales
export * from './create-__projectName__/create-__projectName__.command'
export * from './update-__projectName__/update-__projectName__.command'
export * from './delete-__projectName__/delete-__projectName__.command'
