import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

/**
 * 🔹 Puerto de salida para obtener un __project_name_camel__ por su ID
 */
export abstract class Get__project_name_camel__ByIdPort {
  abstract getById(id: string): Promise<__project_name_pascal__Entity | null>
}

/**
 * 🔹 Puerto de salida para obtener todos los __project_name_camel__
 * 🚨 Usar solo en volúmenes bajos
 */
export abstract class GetAll__project_name_camel__Port {
  abstract getAll(): Promise<__project_name_pascal__Entity[]>
}

/**
 * 🔹 Puerto de salida para obtener paginación por cursor
 */
export abstract class Get__project_name_camel__WithCursorPort {
  abstract getWithCursor(
    afterId: string,
    limit: number
  ): Promise<{
    items: __project_name_pascal__Entity[]
    nextCursor: string | null
    hasMore: boolean
  }>
}
