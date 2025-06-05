/**
 * __ProjectName__Entity
 * -----------------------------------------------------------------------------
 * Esta clase representa la **entidad raíz del agregado** (Aggregate Root)
 * en el contexto del dominio de "__ProjectName__".
 *
 * Forma parte central de la arquitectura DDD, encapsulando:
 *  - Estado (mediante value objects y propiedades internas)
 *  - Comportamiento (métodos como `create`, `update`)
 *  - Eventos de dominio (emitidos cuando hay cambios relevantes)
 *
 * 🔹 No conoce infraestructura (DB, ORM, HTTP)
 * 🔹 No expone datos primitivos directamente
 * 🔹 Se comunica mediante value objects y métodos bien tipados
 *
 * Esta entidad se usa dentro de:
 *  - Command Handlers (aplicación)
 *  - Repositorios (persistencia)
 *  - Servicios de dominio (si hay reglas transversales)
 *
 * Es construida mediante:
 *  - `create()` → cuando se crea un nuevo agregado (con eventos)
 *  - `fromPrimitives()` → cuando se reconstruye desde datos persistidos
 *
 * Es convertida a plano por:
 *  - `toPrimitives()` → para persistencia, serialización o transporte
 *
 * 🧠 Regla general: La entidad define lo que es **válido** en el dominio.
 */

import { AggregateRoot } from '@nestjs/cqrs'
import { v4 as uuidv4 } from 'uuid'

import { NameValueObject } from '../value-objects/name.value-object'
import { DescriptionValueObject } from '../value-objects/description.value-object'

import { __ProjectName__CreatedEvent } from '../events/__projectName__-created.event'
import { __ProjectName__RenamedEvent } from '../events/__projectName__-renamed.event'
import { __ProjectName__DescriptionUpdatedEvent } from '../events/__projectName__-description-updated.event'

/**
 * Representa los campos actualizables de un __ProjectName__.
 * Usado en métodos como `update()`, command handlers y DTOs.
 */
export type __ProjectName__UpdateProps = {
  name?: string
  description?: string
}

/**
 * Representa todos los datos requeridos para construir un __ProjectName__Entity
 * desde una fuente externa como la base de datos.
 */
export interface __ProjectName__Primitives {
  id: string
  name: string
  description: string | null | undefined
  createdAt: Date
  updatedAt?: Date
}

/**
 * Representa los datos internos encapsulados por la entidad,
 * tipados con Value Objects.
 */
export interface __ProjectName__Props {
  name: NameValueObject
  description?: DescriptionValueObject
  createdAt: Date
  updatedAt?: Date
}

/**
 * Entidad raíz del agregado __ProjectName__.
 * Encapsula reglas de negocio, estados y eventos.
 */
export class __ProjectName__Entity extends AggregateRoot {
  constructor(
    public readonly id: string,
    public props: Readonly<__ProjectName__Props>
  ) {
    super()
  }

  /**
   * Método fábrica para crear una nueva entidad con sus reglas e invariantes.
   * Dispara un evento de dominio __ProjectName__CreatedEvent.
   */
  static create(input: { name: string; description?: string }): __ProjectName__Entity {
    const now = new Date()

    const entity = new __ProjectName__Entity(uuidv4(), {
      name: NameValueObject.create(input.name),
      description: DescriptionValueObject.create(input.description),
      createdAt: now,
      updatedAt: now
    })

    entity.apply(new __ProjectName__CreatedEvent(entity))

    return entity
  }

  /**
   * Devuelve una representación plana del estado de la entidad.
   * Útil para persistencia o serialización.
   */
  toPrimitives(): __ProjectName__Primitives {
    return {
      id: this.id,
      name: this.props.name.value,
      description: this.props.description?.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt
    }
  }

  /**
   * Actualiza propiedades de la entidad en base a los datos entrantes.
   * Solo aplica cambios si el valor realmente fue modificado.
   * Emite eventos por cada campo cambiado.
   */
  update(input: __ProjectName__UpdateProps): void {
    const now = new Date()
    let changed = false
    const updated: __ProjectName__Props = { ...this.props }

    const handlers = this.getUpdateHandlers(updated)

    Object.entries(input).forEach(([key, value]) => {
      const handler = handlers[key as keyof __ProjectName__UpdateProps]
      if (handler && value !== undefined) {
        handler(value)
        changed = true
      }
    })

    if (changed) {
      updated.updatedAt = now
      this.props = updated
    }
  }

  /**
   * Retorna los métodos específicos que manejan cada campo actualizable.
   * Se usa internamente en `update()` para modularizar los cambios.
   */
  private getUpdateHandlers(
    updated: __ProjectName__Props
  ): Record<keyof __ProjectName__UpdateProps, (value: any) => void> {
    return {
      name: (value: string) => {
        const newName = NameValueObject.create(value)
        if (!this.props.name.equals(newName)) {
          updated.name = newName
          this.apply(new __ProjectName__RenamedEvent(this.id, newName))
        }
      },
      description: (value: string) => {
        const newDesc = DescriptionValueObject.create(value)
        if (!this.props.description?.equals(newDesc)) {
          updated.description = newDesc
          this.apply(new __ProjectName__DescriptionUpdatedEvent(this.id, newDesc))
        }
      }
    }
  }
}
