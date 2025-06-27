import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

/**
 * 🔹 Puerto de salida para creación de MicromicroEntity
 */
export abstract class CreateMicromicroPort {
  abstract create(
    entity: MicromicroEntity
  ): Promise<MicromicroEntity>
}

/**
 * 🔹 Puerto de salida para actualización de MicromicroEntity
 */
export abstract class UpdateMicromicroPort {
  abstract update(entity: MicromicroEntity): Promise<void>
}

/**
 * 🔹 Puerto de salida para eliminación de MicromicroEntity
 */
export abstract class DeleteMicromicroPort {
  abstract delete(id: string): Promise<void>
}
