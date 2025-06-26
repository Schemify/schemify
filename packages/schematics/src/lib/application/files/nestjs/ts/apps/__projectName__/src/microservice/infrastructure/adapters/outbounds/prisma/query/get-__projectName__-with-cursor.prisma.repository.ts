/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@__projectName__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { Get__ProjectName__sWithCursorPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Injectable()
export class Get__ProjectName__sWithCursorPrismaRepository
  implements Get__ProjectName__sWithCursorPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  async getWithCursor(afterId: string, limit: number) {
    const take = limit + 1
    const results = await this.prisma.__projectNameCamel__.findMany({
      take,
      ...(afterId && { cursor: { id: afterId }, skip: 1 }),
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
