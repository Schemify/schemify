import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

/**
 * 🔹 Puerto de salida para creación de MicroserviceNameEntity
 */
export abstract class CreateMicroserviceNamePort {
  abstract create(
    entity: MicroserviceNameEntity
  ): Promise<MicroserviceNameEntity>
}

/**
 * 🔹 Puerto de salida para actualización de MicroserviceNameEntity
 */
export abstract class UpdateMicroserviceNamePort {
  abstract update(entity: MicroserviceNameEntity): Promise<void>
}

/**
 * 🔹 Puerto de salida para eliminación de MicroserviceNameEntity
 */
export abstract class DeleteMicroserviceNamePort {
  abstract delete(id: string): Promise<void>
}
