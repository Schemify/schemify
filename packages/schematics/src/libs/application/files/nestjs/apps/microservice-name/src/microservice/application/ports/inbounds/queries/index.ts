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
 * export class MicroserviceNameModule {}
 * ```
 *
 * Incluye:
 * - GetAllMicroserviceNameQuery / Handler
 * - GetMicroserviceNameByIdQuery / Handler
 * - GetMicroserviceNameByCursorQuery / Handler
 */

// 📤 Re-exportación directa (para importación individual si se desea)
export * from './get-microservice-name-by-cursor/get-microservice-name-by-cursor.handler'
export * from './get-microservice-name-by-cursor/get-microservice-name-by-cursor.query'
export * from './get-microservice-name-by-id/get-microservice-name-by-id.handler'
export * from './get-microservice-name-by-id/get-microservice-name-by-id.query'
export * from './get-all-microservice-name/get-all-microservice-name.handler'
export * from './get-all-microservice-name/get-all-microservice-name.query'

// 📦 Arreglo centralizado de todos los handlers de queries
import { GetAllMicroserviceNameHandler } from './get-all-microservice-name/get-all-microservice-name.handler'
import { GetMicroserviceNameByIdHandler } from './get-microservice-name-by-id/get-microservice-name-by-id.handler'
import { GetMicroserviceNameByCursorHandler } from './get-microservice-name-by-cursor/get-microservice-name-by-cursor.handler'
/**
 * Conjunto de handlers registrados por NestJS en el QueryBus
 */
export const QueryHandlers = [
  GetAllMicroserviceNameHandler,
  GetMicroserviceNameByIdHandler,
  GetMicroserviceNameByCursorHandler
]
