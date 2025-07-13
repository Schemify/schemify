/**
 * GetMicroserviceNameByIdQuery
 * -----------------------------------------------------------------------------
 * Query de lectura que solicita un `MicroserviceNameEntity` específico por su ID.
 *
 * Este objeto es procesado por el `GetMicroserviceNameByIdHandler`, quien se encarga de
 * obtener la entidad correspondiente desde el repositorio de solo lectura.
 *
 * Se usa en lectura directa, sin emitir eventos ni modificar el estado.
 */

import { IQuery } from '@nestjs/cqrs'

export class GetMicroserviceNameByIdQuery implements IQuery {
  constructor(
    /**
     * Payload de la query
     * @property id ID único del MicroserviceName a buscar
     */
    public readonly payload: { id: string }
  ) {}
}
