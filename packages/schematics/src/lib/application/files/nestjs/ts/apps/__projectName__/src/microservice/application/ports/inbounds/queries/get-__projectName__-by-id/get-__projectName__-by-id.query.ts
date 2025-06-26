/**
 * Get__ProjectName__ByIdQuery
 * -----------------------------------------------------------------------------
 * Query de lectura que solicita un `__ProjectName__Entity` específico por su ID.
 *
 * Este objeto es procesado por el `Get__ProjectName__ByIdHandler`, quien se encarga de
 * obtener la entidad correspondiente desde el repositorio de solo lectura.
 *
 * Se usa en lectura directa, sin emitir eventos ni modificar el estado.
 */

import { IQuery } from '@nestjs/cqrs'

export class Get__ProjectName__ByIdQuery implements IQuery {
  constructor(
    /**
     * Payload de la query
     * @property id ID único del __ProjectName__ a buscar
     */
    public readonly payload: { id: string }
  ) {}
}
