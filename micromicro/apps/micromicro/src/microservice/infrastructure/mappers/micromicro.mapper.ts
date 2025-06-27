/**
 * MicromicroMapper
 * -----------------------------------------------------------------------------
 * Mapper responsable de transformar datos entre distintas capas del sistema:
 *
 *  - 🌐 Infraestructura (ej. Protobuf, HTTP, DB)
 *  - 🧠 Dominio (Entity + ValueObjects)
 *  - 🧱 Persistencia (Primitives)
 *
 * Este mapper aísla las conversiones para mantener los handlers y servicios limpios.
 */

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

import { NameValueObject } from '@micromicro/microservice/domain/value-objects/name.value-object'
import { DescriptionValueObject } from '@micromicro/microservice/domain/value-objects/description.value-object'

import {
  MicromicroProps,
  MicromicroPrimitives
} from '@micromicro/microservice/domain/entities/micromicro.entity'

import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'

export class MicromicroMapper {
  /**
   * Transforma un objeto recibido desde Protobuf a props del dominio.
   *
   * ✅ Se usa como entrada para `MicromicroEntity.create(...)`
   * ✅ Valida automáticamente usando los ValueObjects
   *
   * @param proto Objeto recibido del micromicro gRPC (ej: del controller)
   * @returns Props válidos para la entidad
   */
  protoToProps(proto: {
    name: string
    description?: string
  }): Omit<MicromicroProps, 'createdAt' | 'updatedAt'> {
    return {
      name: NameValueObject.create(proto.name),
      description: DescriptionValueObject.create(proto.description)
    }
  }

  /**
   * Convierte una entidad del dominio a su representación Protobuf.
   *
   * ✅ Usado por handlers o resolvers gRPC para responder al micromicro
   * ✅ No expone ValueObjects directamente
   *
   * @param entity Entidad del dominio
   * @returns Objeto Protobuf plano
   */
  entityToProto(entity: MicromicroEntity): {
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
   * ✅ Compatible con `MicromicroEntity.fromPrimitives()`
   *
   * @param entity Entidad completa del dominio
   * @returns Objeto plano (primitives)
   */
  toPrimitives(
    entity: MicromicroEntity
  ): MicromicroPrimitives {
    return entity.toPrimitives()
  }

  /**
   * Reconstruye una entidad del dominio desde un objeto plano (por ejemplo, desde la DB).
   *
   * ✅ Usado por repositorios al leer datos de persistencia
   * ✅ Reconstruye ValueObjects internamente
   *
   * @param input Datos planos persistidos
   * @returns Instancia válida de `MicromicroEntity`
   */
  fromPrimitives(
    input: MicromicroPrimitives
  ): MicromicroEntity {
    return new MicromicroEntity(input.id, {
      name: NameValueObject.create(input.name),
      description: DescriptionValueObject.create(
        input.description ?? undefined
      ),
      createdAt: input.createdAt,
      updatedAt: input.updatedAt ?? input.createdAt
    })
  }

  fromEnvelope(input: MicromicroCreatedEvent): {
    name: string
    description?: string
  } {
    return {
      name: input.micromicro.props.name.value,
      description: input.micromicro.props.description?.value
    }
  }
}
