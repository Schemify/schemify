import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

/**
 * 🔹 Puerto de salida para obtener un Micromicro por su ID
 */
export abstract class GetMicromicroByIdPort {
  abstract getById(id: string): Promise<MicromicroEntity | null>
}

/**
 * 🔹 Puerto de salida para obtener todos los Micromicro
 * 🚨 Usar solo en volúmenes bajos
 */
export abstract class GetAllMicromicroPort {
  abstract getAll(): Promise<MicromicroEntity[]>
}

/**
 * 🔹 Puerto de salida para obtener paginación por cursor
 */
export abstract class GetMicromicroWithCursorPort {
  abstract getWithCursor(
    afterId: string,
    limit: number
  ): Promise<{
    items: MicromicroEntity[]
    nextCursor: string | null
    hasMore: boolean
  }>
}
