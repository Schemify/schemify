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
 * export class __ProjectName__Module {}
 * ```
 *
 * Incluye:
 * - GetAll__ProjectName__sQuery / Handler
 * - Get__ProjectName__ByIdQuery / Handler
 * - Get__ProjectName__sByCursorQuery / Handler
 */

// 📤 Re-exportación directa (para importación individual si se desea)
export * from './get-all-__projectName__/get-all-__projectName__.handler'
export * from './get-all-__projectName__/get-all-__projectName__.query'
export * from './get-__projectName__-by-id/get-__projectName__-by-id.handler'
export * from './get-__projectName__-by-id/get-__projectName__-by-id.query'
export * from './get-__projectName__-by-cursor/get-__projectName__-by-cursor.handler'
export * from './get-__projectName__-by-cursor/get-__projectName__-by-cursor.query'

// 📦 Arreglo centralizado de todos los handlers de queries
import { GetAll__ProjectName__sHandler } from './get-all-__projectName__/get-all-__projectName__.handler'
import { Get__ProjectName__ByIdHandler } from './get-__projectName__-by-id/get-__projectName__-by-id.handler'
import { Get__ProjectName__sByCursorHandler } from './get-__projectName__-by-cursor/get-__projectName__-by-cursor.handler'

/**
 * Conjunto de handlers registrados por NestJS en el QueryBus
 */
export const QueryHandlers = [
  GetAll__ProjectName__sHandler,
  Get__ProjectName__ByIdHandler,
  Get__ProjectName__sByCursorHandler
]
