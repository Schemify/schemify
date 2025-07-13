/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@microserviceName/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetMicroserviceNameWithCursorPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-query-ports'

import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

@Injectable()
export class GetMicroserviceNameWithCursorPrismaRepository
  implements GetMicroserviceNameWithCursorPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  async getWithCursor(cursor?: string, limit: number = 10) {
    const results = await this.prisma.microserviceName.findMany({
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
