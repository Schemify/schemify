/**
 * GetAll__project_name_pascal__Query
 * -----------------------------------------------------------------------------
 * Query de lectura (CQRS) para obtener todos los registros `__project_name_camel__Entity`.
 *
 * No requiere parámetros.
 *
 * Es manejada por `GetAll__project_name_camel__Handler`, quien delega al repositorio
 * correspondiente y transforma los datos si es necesario.
 */

import { IQuery } from '@nestjs/cqrs'

export class GetAll__project_name_pascal__Query implements IQuery {
  constructor() {}
}
