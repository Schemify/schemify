/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@__projectName__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { Get__ProjectName__ByIdPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Injectable()
export class Get__ProjectName__ByIdPrismaRepository
  implements Get__ProjectName__ByIdPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  async getById(id: string): Promise<__ProjectName__Entity | null> {
    const result = await this.prisma.__projectNameCamel__.findUnique({
      where: { id }
    })

    if (!result) return null

    return this.mapper.fromPrimitives(result)
  }
}
