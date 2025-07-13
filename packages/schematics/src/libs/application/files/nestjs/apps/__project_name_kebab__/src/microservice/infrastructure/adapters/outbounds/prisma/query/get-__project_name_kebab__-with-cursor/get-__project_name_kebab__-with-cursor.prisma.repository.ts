/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from 'apps/__project_name_kebab__/src/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { Get__project_name_camel__WithCursorPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Injectable()
export class Get__project_name_camel__WithCursorPrismaRepository
  implements Get__project_name_camel__WithCursorPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  async getWithCursor(cursor?: string, limit: number = 10) {
    const results = await this.prisma.__project_name_pascal__.findMany({
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
