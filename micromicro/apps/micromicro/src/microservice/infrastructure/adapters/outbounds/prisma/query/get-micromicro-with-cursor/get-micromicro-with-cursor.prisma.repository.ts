/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@micromicro/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetMicromicroWithCursorPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Injectable()
export class GetMicromicroWithCursorPrismaRepository
  implements GetMicromicroWithCursorPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicromicroMapper
  ) {}

  async getWithCursor(
    cursor?: string,
    limit: number = 10
  ): Promise<CursorResult<MicromicroEntity>> {
    const results = await this.prisma.micromicro.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: 'asc' }
    })

    const hasMore = results.length > limit
    const sliced = hasMore ? results.slice(0, -1) : results
    const last = sliced.at(-1)

    return {
      items: sliced.map((r) => this.mapper.fromPrimitives(r)),
      nextCursor: last?.id ?? null,
      hasMore
    }
  }
}
