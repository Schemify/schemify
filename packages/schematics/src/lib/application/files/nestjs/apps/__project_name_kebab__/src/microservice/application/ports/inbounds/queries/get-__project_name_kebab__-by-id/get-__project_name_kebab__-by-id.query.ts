/**
 * Get__project_name_pascal__ByIdQuery
 * -----------------------------------------------------------------------------
 * Query de lectura que solicita un `__project_name_pascal__Entity` específico por su ID.
 *
 * Este objeto es procesado por el `Get__project_name_pascal__ByIdHandler`, quien se encarga de
 * obtener la entidad correspondiente desde el repositorio de solo lectura.
 *
 * Se usa en lectura directa, sin emitir eventos ni modificar el estado.
 */

import { IQuery } from '@nestjs/cqrs'

export class Get__project_name_pascal__ByIdQuery implements IQuery {
  constructor(
    /**
     * Payload de la query
     * @property id ID único del __project_name_pascal__ a buscar
     */
    public readonly payload: { id: string }
  ) {}
}
