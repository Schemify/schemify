/**
 * Punto de entrada para la capa de **queries** (CQRS).
 *
 * Expone todas las queries y sus respectivos handlers como módulos reutilizables.
 * También exporta un arreglo `QueryHandlers` que puede ser registrado directamente
 * en el módulo principal (`@Module`) para cargar el QueryBus de NestJS.
 *
 * Uso recomendado:
 *
 * ```ts
 * import { QueryHandlers } from './application/queries'
 *
 * @Module({
 *   providers: [...QueryHandlers],
 * })
 * export class __project_name_pascal__Module {}
 * ```
 *
 * Incluye:
 * - GetAll__project_name_pascal__Query / Handler
 * - Get__project_name_pascal__ByIdQuery / Handler
 * - Get__project_name_pascal__ByCursorQuery / Handler
 */

// 📤 Re-exportación directa (para importación individual si se desea)
export * from './get-all-__project_name_kebab__/get-all-__project_name_kebab__.handler'
export * from './get-all-__project_name_kebab__/get-all-__project_name_kebab__.query'
export * from './get-__project_name_kebab__-by-id/get-__project_name_kebab__-by-id.handler'
export * from './get-__project_name_kebab__-by-id/get-__project_name_kebab__-by-id.query'
export * from './get-__project_name_kebab__-by-cursor/get-__project_name_kebab__-by-cursor.handler'
export * from './get-__project_name_kebab__-by-cursor/get-__project_name_kebab__-by-cursor.query'

// 📦 Arreglo centralizado de todos los handlers de queries
import { GetAll__project_name_pascal__Handler } from './get-all-__project_name_kebab__/get-all-__project_name_kebab__.handler'
import { Get__project_name_pascal__ByIdHandler } from './get-__project_name_kebab__-by-id/get-__project_name_kebab__-by-id.handler'
import { Get__project_name_pascal__ByCursorHandler } from './get-__project_name_kebab__-by-cursor/get-__project_name_kebab__-by-cursor.handler'

/**
 * Conjunto de handlers registrados por NestJS en el QueryBus
 */
export const QueryHandlers = [
  GetAll__project_name_pascal__Handler,
  Get__project_name_pascal__ByIdHandler,
  Get__project_name_pascal__ByCursorHandler
]
