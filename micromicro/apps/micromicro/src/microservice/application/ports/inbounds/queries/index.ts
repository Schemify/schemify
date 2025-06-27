// 📤 Re-exportación directa (para importación individual si se desea)
export * from './get-all-micromicro/get-all-micromicro.handler'
export * from './get-all-micromicro/get-all-micromicro.query'
export * from './get-micromicro-by-id/get-micromicro-by-id.handler'
export * from './get-micromicro-by-id/get-micromicro-by-id.query'
export * from './get-micromicro-by-cursor/get-micromicro-by-cursor.handler'
export * from './get-micromicro-by-cursor/get-micromicro-by-cursor.query'

// 📦 Arreglo centralizado de todos los handlers de queries
import { GetAllMicromicroHandler } from './get-all-micromicro/get-all-micromicro.handler'
import { GetMicromicroByIdHandler } from './get-micromicro-by-id/get-micromicro-by-id.handler'
import { GetMicromicroByCursorHandler } from './get-micromicro-by-cursor/get-micromicro-by-cursor.handler'

/**
 * Conjunto de handlers registrados por NestJS en el QueryBus
 */
export const QueryHandlers = [
  GetAllMicromicroHandler,
  GetMicromicroByIdHandler,
  GetMicromicroByCursorHandler
]
