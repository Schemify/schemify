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
 * export class __project_name_pascal__Module {}
 * ```
 */

// 📦 Array con todos los Command Handlers
import { Create__project_name_pascal__Handler } from './create-__project_name_kebab__/create-__project_name_kebab__.handler'
import { Update__project_name_pascal__Handler } from './update-__project_name_kebab__/update-__project_name_kebab__.handler'
import { Delete__project_name_pascal__Handler } from './delete-__project_name_kebab__/delete-__project_name_kebab__.handler'

/**
 * Handlers a registrar en el CommandBus
 */
export const CommandHandlers = [
  Create__project_name_pascal__Handler,
  Update__project_name_pascal__Handler,
  Delete__project_name_pascal__Handler
]

// 📤 Reexportación directa de los comandos para facilitar imports individuales
export * from './create-__project_name_kebab__/create-__project_name_kebab__.command'
export * from './update-__project_name_kebab__/update-__project_name_kebab__.command'
export * from './delete-__project_name_kebab__/delete-__project_name_kebab__.command'
