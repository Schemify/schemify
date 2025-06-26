import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

/**
 * 🔹 Puerto de salida para creación de __ProjectName__Entity
 */
export abstract class Create__ProjectName__Port {
  abstract create(entity: __ProjectName__Entity): Promise<__ProjectName__Entity>
}

/**
 * 🔹 Puerto de salida para actualización de __ProjectName__Entity
 */
export abstract class Update__ProjectName__Port {
  abstract update(entity: __ProjectName__Entity): Promise<void>
}

/**
 * 🔹 Puerto de salida para eliminación de __ProjectName__Entity
 */
export abstract class Delete__ProjectName__Port {
  abstract delete(id: string): Promise<void>
}
