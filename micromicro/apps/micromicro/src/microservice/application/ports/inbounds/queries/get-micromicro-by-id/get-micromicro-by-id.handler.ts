import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { GetMicromicroByIdQuery } from './get-micromicro-by-id.query'

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

@QueryHandler(GetMicromicroByIdQuery)
export class GetMicromicroByIdHandler
  implements IQueryHandler<GetMicromicroByIdQuery>
{
  constructor(
    @Inject(GetMicromicroByIdPort)
    private readonly queryRepository: GetMicromicroByIdPort
  ) {}

  /**
   * Ejecuta la query `GetMicromicroByIdQuery`.
   *
   * @param query Objeto con el ID del agregado a buscar
   * @returns `MicromicroEntity` si se encuentra, o `null` si no existe
   */
  async execute(
    query: GetMicromicroByIdQuery
  ): Promise<MicromicroEntity | null> {
    return this.queryRepository.getById(query.payload.id)
  }
}
