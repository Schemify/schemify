import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

/**
 * 🔹 Puerto de salida para obtener un MicroserviceName por su ID
 */
export abstract class GetMicroserviceNameByIdPort {
  abstract getById(id: string): Promise<MicroserviceNameEntity | null>
}

/**
 * 🔹 Puerto de salida para obtener todos los MicroserviceName
 * 🚨 Usar solo en volúmenes bajos
 */
export abstract class GetAllMicroserviceNamePort {
  abstract getAll(): Promise<MicroserviceNameEntity[]>
}

/**
 * 🔹 Puerto de salida para obtener paginación por cursor
 */
export abstract class GetMicroserviceNameWithCursorPort {
  abstract getWithCursor(
    afterId: string,
    limit: number
  ): Promise<{
    items: MicroserviceNameEntity[]
    nextCursor: string | null
    hasMore: boolean
  }>
}
