import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

import { GetAllMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { GetAllMicromicroQuery } from './get-all-micromicro.query'

@QueryHandler(GetAllMicromicroQuery)
export class GetAllMicromicroHandler
  implements IQueryHandler<GetAllMicromicroQuery>
{
  constructor(
    @Inject(GetAllMicromicroPort)
    private readonly getAllMicromicroPort: GetAllMicromicroPort
  ) {}

  /**
   * Ejecuta la query `GetAllMicromicroQuery`.
   *
   * @returns Lista de entidades del dominio `MicromicroEntity[]`
   */
  async execute(): Promise<MicromicroEntity[]> {
    return this.getAllMicromicroPort.getAll()
  }
}
