import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { GetMicromicroByCursorQuery } from './get-micromicro-by-cursor.query'

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

import { GetMicromicroWithCursorPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

@QueryHandler(GetMicromicroByCursorQuery)
export class GetMicromicroByCursorHandler
  implements IQueryHandler<GetMicromicroByCursorQuery>
{
  constructor(
    @Inject(GetMicromicroWithCursorPort)
    private readonly getMicromicroWithCursorPort: GetMicromicroWithCursorPort
  ) {}

  /**
   * Ejecuta la query con paginación basada en cursor.
   *
   * @param query Query con parámetros de paginación (`afterId`, `limit`)
   * @returns Objeto con:
   *  - `items`: lista de entidades
   *  - `nextCursor`: cursor para la siguiente página
   *  - `hasMore`: indicador si hay más datos
   */
  async execute(query: GetMicromicroByCursorQuery): Promise<{
    items: MicromicroEntity[]
    nextCursor: string | null
    hasMore: boolean
  }> {
    const { afterId, limit } = query.payload

    const result = await this.getMicromicroWithCursorPort.getWithCursor(
      afterId,
      limit
    )

    return {
      items: result.items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore
    }
  }
}
