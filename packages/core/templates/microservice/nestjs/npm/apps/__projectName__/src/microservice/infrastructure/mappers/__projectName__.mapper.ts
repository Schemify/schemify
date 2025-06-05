/**
 * __ProjectName__Mapper
 * -----------------------------------------------------------------------------
 * Mapper responsable de transformar datos entre distintas capas del sistema:
 *
 *  - 🌐 Infraestructura (ej. Protobuf, HTTP, DB)
 *  - 🧠 Dominio (Entity + ValueObjects)
 *  - 🧱 Persistencia (Primitives)
 *
 * Este mapper aísla las conversiones para mantener los handlers y servicios limpios.
 */

import { __projectNameCamel__ } from '@proto'
import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { NameValueObject } from '@__projectName__/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from '@__projectName__/microservice/domain/value-objects/description.value-object'

import {
  __ProjectName__Props,
  __ProjectName__Primitives
} from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { Create__ProjectName__Dto } from 'libs/proto/generated/__projectName__'
import { __ProjectName__CreatedEvent } from '@__projectName__/microservice/domain/events/__projectName__-created.event'

export class __ProjectName__Mapper {
  /**
   * Transforma un objeto recibido desde Protobuf a props del dominio.
   *
   * ✅ Se usa como entrada para `__ProjectName__Entity.create(...)`
   * ✅ Valida automáticamente usando los ValueObjects
   *
   * @param proto Objeto recibido del cliente gRPC (ej: del controller)
   * @returns Props válidos para la entidad
   */
  protoToProps(proto: {
    name: string
    description?: string
  }): Omit<__ProjectName__Props, 'createdAt' | 'updatedAt'> {
    return {
      name: NameValueObject.create(proto.name),
      description: DescriptionValueObject.create(proto.description)
    }
  }

  /**
   * Convierte una entidad del dominio a su representación Protobuf.
   *
   * ✅ Usado por handlers o resolvers gRPC para responder al cliente
   * ✅ No expone ValueObjects directamente
   *
   * @param entity Entidad del dominio
   * @returns Objeto Protobuf plano
   */
  entityToProto(entity: __ProjectName__Entity): __projectNameCamel__.__ProjectName__{
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
   * ✅ Compatible con `__ProjectName__Entity.fromPrimitives()`
   *
   * @param entity Entidad completa del dominio
   * @returns Objeto plano (primitives)
   */
  toPrimitives(entity: __ProjectName__Entity): __ProjectName__Primitives {
    return entity.toPrimitives()
  }

  /**
   * Reconstruye una entidad del dominio desde un objeto plano (por ejemplo, desde la DB).
   *
   * ✅ Usado por repositorios al leer datos de persistencia
   * ✅ Reconstruye ValueObjects internamente
   *
   * @param input Datos planos persistidos
   * @returns Instancia válida de `__ProjectName__Entity`
   */
  fromPrimitives(input: __ProjectName__Primitives): __ProjectName__Entity {
    return new __ProjectName__Entity(input.id, {
      name: NameValueObject.create(input.name),
      description: DescriptionValueObject.create(
        input.description ?? undefined
      ),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt ?? input.createdAt
    })
  }

  fromEnvelope(input: __ProjectName__CreatedEvent): Create__ProjectName__Dto {
    return {
      name: input.__projectNameCamel__.props.name.value,
      description: input.__projectNameCamel__.props.description?.value
    }
  }
}
