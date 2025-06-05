/**
 * __ProjectName__CreatedEvent
 * -----------------------------------------------------------------------------
 * Evento de dominio que representa la creación exitosa de un nuevo `__ProjectName__Entity`.
 *
 * Es emitido dentro del método `__ProjectName__Entity.create()`.
 *
 * Este evento puede ser utilizado para:
 *  - Auditar la creación de recursos
 *  - Disparar integraciones externas
 *  - Notificar a otras partes del sistema (proyecciones, otros microservicios)
 *  - Iniciar flujos secundarios o comandos relacionados
 *  - Disparar lógica reactiva (envío de emails, logging, etc.)
 */

import { IEvent } from '@nestjs/cqrs'
import { __ProjectName__Entity } from '../entities/__projectName__.entity'

export class __ProjectName__CreatedEvent implements IEvent {
  public readonly occurredAt: Date
  public readonly __projectNameCamel__: __ProjectName__Entity

  constructor(__projectNameCamel__: __ProjectName__Entity) {
    this.occurredAt = new Date()
    this.__projectNameCamel__ = __projectNameCamel__
  }
}
