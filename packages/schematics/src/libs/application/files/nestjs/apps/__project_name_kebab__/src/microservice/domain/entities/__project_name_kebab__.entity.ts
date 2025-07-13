import { AggregateRoot } from '@nestjs/cqrs'
import { v4 as uuidv4 } from 'uuid'

import { NameValueObject } from '../value-objects/name.value-object'
import { DescriptionValueObject } from '../value-objects/description.value-object'

import { __project_name_pascal__CreatedEvent } from '../events/__project_name_kebab__-created.event'
import { __project_name_pascal__RenamedEvent } from '../events/__project_name_kebab__-renamed.event'
import { __project_name_pascal__DescriptionUpdatedEvent } from '../events/__project_name_kebab__-description-updated.event'

export type __project_name_pascal__UpdateProps = {
  name?: string
  description?: string
}

/**
 * Representa todos los datos requeridos para construir un __project_name_pascal__Entity
 * desde una fuente externa como la base de datos.
 */
export interface __project_name_pascal__Primitives {
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
export interface __project_name_pascal__Props {
  name: NameValueObject
  description?: DescriptionValueObject
  createdAt: Date
  updatedAt?: Date
}

/**
 * Entidad raíz del agregado __project_name_pascal__.
 * Encapsula reglas de negocio, estados y eventos.
 */
export class __project_name_pascal__Entity extends AggregateRoot {
  constructor(
    public readonly id: string,
    public props: Readonly<__project_name_pascal__Props>
  ) {
    super()
  }

  /**
   * Método fábrica para crear una nueva entidad con sus reglas e invariantes.
   * Dispara un evento de dominio __project_name_camel__CreatedEvent.
   */
  static create(input: {
    name: string
    description?: string
  }): __project_name_pascal__Entity {
    const now = new Date()

    const entity = new __project_name_pascal__Entity(uuidv4(), {
      name: NameValueObject.create(input.name),
      description: DescriptionValueObject.create(input.description),
      createdAt: now,
      updatedAt: now
    })

    entity.apply(new __project_name_camel__CreatedEvent(entity))

    return entity
  }

  /**
   * Devuelve una representación plana del estado de la entidad.
   * Útil para persistencia o serialización.
   */
  toPrimitives(): __project_name_pascal__Primitives {
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
  update(input: __project_name_pascal__UpdateProps): void {
    const now = new Date()
    let changed = false
    const updated: __project_name_pascal__Props = { ...this.props }

    const handlers = this.getUpdateHandlers(updated)

    Object.entries(input).forEach(([key, value]) => {
      const handler = handlers[key as keyof __project_name_pascal__UpdateProps]
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
    updated: __project_name_pascal__Props
  ): Record<keyof __project_name_pascal__UpdateProps, (value: any) => void> {
    return {
      name: (value: string) => {
        const newName = NameValueObject.create(value)
        if (!this.props.name.equals(newName)) {
          updated.name = newName
          this.apply(new __project_name_pascal__RenamedEvent(this.id, newName))
        }
      },
      description: (value: string) => {
        const newDesc = DescriptionValueObject.create(value)
        if (!this.props.description?.equals(newDesc)) {
          updated.description = newDesc
          this.apply(
            new __project_name_pascal__DescriptionUpdatedEvent(this.id, newDesc)
          )
        }
      }
    }
  }
}
