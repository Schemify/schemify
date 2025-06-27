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
 * export class MicromicroModule {}
 * ```
 */

// 📦 Array con todos los Command Handlers
import { CreateMicromicroHandler } from './create-micromicro/create-micromicro.handler'
import { UpdateMicromicroHandler } from './update-micromicro/update-micromicro.handler'
import { DeleteMicromicroHandler } from './delete-micromicro/delete-micromicro.handler'

/**
 * Handlers a registrar en el CommandBus
 */
export const CommandHandlers = [
  CreateMicromicroHandler,
  UpdateMicromicroHandler,
  DeleteMicromicroHandler
]

// 📤 Reexportación directa de los comandos para facilitar imports individuales
export * from './create-micromicro/create-micromicro.command'
export * from './update-micromicro/update-micromicro.command'
export * from './delete-micromicro/delete-micromicro.command'
