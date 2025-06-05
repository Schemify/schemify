/**
 * GetAll__ProjectName__sQuery
 * -----------------------------------------------------------------------------
 * Query de lectura (CQRS) para obtener todos los registros `__ProjectName__Entity`.
 *
 * No requiere parámetros.
 *
 * Es manejada por `GetAll__ProjectName__sHandler`, quien delega al repositorio
 * correspondiente y transforma los datos si es necesario.
 */

import { IQuery } from '@nestjs/cqrs'

export class GetAll__ProjectName__sQuery implements IQuery {
  constructor() {}
}
