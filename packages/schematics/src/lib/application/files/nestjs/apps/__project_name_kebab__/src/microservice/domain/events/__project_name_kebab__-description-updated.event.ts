/**
 * __project_name_pascal__DescriptionUpdatedEvent
 * -----------------------------------------------------------------------------
 * Evento de dominio que indica que la descripción de un `__project_name_pascal__Entity` fue modificada.
 *
 * Es emitido desde el método `update()` si la descripción cambia.
 *
 * Casos de uso típicos:
 *  - Actualizar descripciones en sistemas de búsqueda
 *  - Replicar cambios a vistas de lectura o motores de indexado
 *  - Registrar historial de cambios
 */

import { IEvent } from '@nestjs/cqrs'
import { DescriptionValueObject } from '../value-objects/description.value-object'

export class __project_name_pascal__DescriptionUpdatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly newDescription: DescriptionValueObject
  ) {}
}
