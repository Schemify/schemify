/**
 * GetAllMicroserviceNameQuery
 * -----------------------------------------------------------------------------
 * Query de lectura (CQRS) para obtener todos los registros `MicroserviceNameEntity`.
 *
 * No requiere parámetros.
 *
 * Es manejada por `GetAllMicroserviceNameHandler`, quien delega al repositorio
 * correspondiente y transforma los datos si es necesario.
 */

import { IQuery } from '@nestjs/cqrs'

export class GetAllMicroserviceNameQuery implements IQuery {
  constructor() {}
}
