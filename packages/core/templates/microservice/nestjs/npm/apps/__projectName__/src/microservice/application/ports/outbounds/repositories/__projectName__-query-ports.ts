import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

/**
 * 🔹 Puerto de salida para obtener un __ProjectName__ por su ID
 */
export abstract class Get__ProjectName__ByIdPort {
  abstract getById(id: string): Promise<__ProjectName__Entity | null>
}

/**
 * 🔹 Puerto de salida para obtener todos los __ProjectName__
 * 🚨 Usar solo en volúmenes bajos
 */
export abstract class GetAll__ProjectName__sPort {
  abstract getAll(): Promise<__ProjectName__Entity[]>
}

/**
 * 🔹 Puerto de salida para obtener paginación por cursor
 */
export abstract class Get__ProjectName__sWithCursorPort {
  abstract getWithCursor(
    afterId: string,
    limit: number
  ): Promise<{
    items: __ProjectName__Entity[]
    nextCursor: string | null
    hasMore: boolean
  }>
}
