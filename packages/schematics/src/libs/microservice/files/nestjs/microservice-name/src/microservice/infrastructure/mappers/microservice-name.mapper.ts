import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

import { NameValueObject } from '@microserviceName/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from '@microserviceName/microservice/domain/value-objects/description.value-object'

import {
  MicroserviceNameProps,
  MicroserviceNamePrimitives
} from '@microserviceName/microservice/domain/entities/microserviceName.entity'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'

export class MicroserviceNameMapper {
  /**
   * Transforma un objeto recibido desde Protobuf a props del dominio.
   *
   * ✅ Se usa como entrada para `MicroserviceNameEntity.create(...)`
   * ✅ Valida automáticamente usando los ValueObjects
   *
   * @param proto Objeto recibido del microserviceName gRPC (ej: del controller)
   * @returns Props válidos para la entidad
   */
  protoToProps(proto: {
    name: string
    description?: string
  }): Omit<MicroserviceNameProps, 'createdAt' | 'updatedAt'> {
    return {
      name: NameValueObject.create(proto.name),
      description: DescriptionValueObject.create(proto.description)
    }
  }

  /**
   * Convierte una entidad del dominio a su representación Protobuf.
   *
   * ✅ Usado por handlers o resolvers gRPC para responder al microserviceName
   * ✅ No expone ValueObjects directamente
   *
   * @param entity Entidad del dominio
   * @returns Objeto Protobuf plano
   */
  entityToProto(entity: MicroserviceNameEntity): {
    id: string
    name: string
    description?: string
  } {
    if (!entity) {
      throw new Error('entityToProto: received undefined entity')
    }

    return {
      id: entity.id,
      name: entity.props.name.value,
      description: entity.props.description?.value
    }
  }

  /**
   * Convierte una entidad en un objeto plano (primitives) para persistencia.
   *
   * ✅ Usado por la capa de infraestructura para guardar en DB
   * ✅ Compatible con `MicroserviceNameEntity.fromPrimitives()`
   *
   * @param entity Entidad completa del dominio
   * @returns Objeto plano (primitives)
   */
  toPrimitives(entity: MicroserviceNameEntity): MicroserviceNamePrimitives {
    return entity.toPrimitives()
  }

  /**
   * Reconstruye una entidad del dominio desde un objeto plano (por ejemplo, desde la DB).
   *
   * ✅ Usado por repositorios al leer datos de persistencia
   * ✅ Reconstruye ValueObjects internamente
   *
   * @param input Datos planos persistidos
   * @returns Instancia válida de `MicroserviceNameEntity`
   */
  fromPrimitives(input: MicroserviceNamePrimitives): MicroserviceNameEntity {
    return new MicroserviceNameEntity(input.id, {
      name: NameValueObject.create(input.name),
      description: DescriptionValueObject.create(
        input.description ?? undefined
      ),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt ?? input.createdAt
    })
  }

  fromEnvelope(input: MicroserviceNameCreatedEvent): {
    name: string
    description?: string
  } {
    return {
      name: input.microserviceName.props.name.value,
      description: input.microserviceName.props.description?.value
    }
  }
}
