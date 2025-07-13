import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { NameValueObject } from 'apps/__project_name_kebab__/src/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from 'apps/__project_name_kebab__/src/microservice/domain/value-objects/description.value-object'

import {
  __project_name_pascal__Props,
  __project_name_pascal__Primitives
} from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { __project_name_pascal__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'

export class __project_name_pascal__Mapper {
  /**
   * Transforma un objeto recibido desde Protobuf a props del dominio.
   *
   * ✅ Se usa como entrada para `__project_name_pascal__Entity.create(...)`
   * ✅ Valida automáticamente usando los ValueObjects
   *
   * @param proto Objeto recibido del __project_name_pascal__ gRPC (ej: del controller)
   * @returns Props válidos para la entidad
   */
  protoToProps(proto: {
    name: string
    description?: string
  }): Omit<__project_name_pascal__Props, 'createdAt' | 'updatedAt'> {
    return {
      name: NameValueObject.create(proto.name),
      description: DescriptionValueObject.create(proto.description)
    }
  }

  /**
   * Convierte una entidad del dominio a su representación Protobuf.
   *
   * ✅ Usado por handlers o resolvers gRPC para responder al __project_name_pascal__
   * ✅ No expone ValueObjects directamente
   *
   * @param entity Entidad del dominio
   * @returns Objeto Protobuf plano
   */
  entityToProto(entity: __project_name_pascal__Entity): {
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
   * ✅ Compatible con `__project_name_pascal__Entity.fromPrimitives()`
   *
   * @param entity Entidad completa del dominio
   * @returns Objeto plano (primitives)
   */
  toPrimitives(
    entity: __project_name_pascal__Entity
  ): __project_name_pascal__Primitives {
    return entity.toPrimitives()
  }

  /**
   * Reconstruye una entidad del dominio desde un objeto plano (por ejemplo, desde la DB).
   *
   * ✅ Usado por repositorios al leer datos de persistencia
   * ✅ Reconstruye ValueObjects internamente
   *
   * @param input Datos planos persistidos
   * @returns Instancia válida de `__project_name_pascal__Entity`
   */
  fromPrimitives(
    input: __project_name_pascal__Primitives
  ): __project_name_pascal__Entity {
    return new __project_name_pascal__Entity(input.id, {
      name: NameValueObject.create(input.name),
      description: DescriptionValueObject.create(
        input.description ?? undefined
      ),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt ?? input.createdAt
    })
  }

  fromEnvelope(input: __project_name_pascal__CreatedEvent): {
    name: string
    description?: string
  } {
    return {
      name: input.__project_name_camel__.props.name.value,
      description: input.__project_name_camel__.props.description?.value
    }
  }
}
