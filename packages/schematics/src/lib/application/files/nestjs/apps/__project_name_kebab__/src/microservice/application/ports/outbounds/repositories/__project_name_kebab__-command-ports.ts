import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

/**
 * 🔹 Puerto de salida para creación de __project_name_pascal__Entity
 */
export abstract class Create__project_name_pascal__Port {
  abstract create(
    entity: __project_name_pascal__Entity
  ): Promise<__project_name_pascal__Entity>
}

/**
 * 🔹 Puerto de salida para actualización de __project_name_pascal__Entity
 */
export abstract class Update__project_name_pascal__Port {
  abstract update(entity: __project_name_pascal__Entity): Promise<void>
}

/**
 * 🔹 Puerto de salida para eliminación de __project_name_pascal__Entity
 */
export abstract class Delete__project_name_pascal__Port {
  abstract delete(id: string): Promise<void>
}
