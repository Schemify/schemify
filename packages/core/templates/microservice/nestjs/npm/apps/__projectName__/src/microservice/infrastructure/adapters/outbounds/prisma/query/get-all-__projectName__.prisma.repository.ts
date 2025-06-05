/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@__projectName__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetAll__ProjectName__sPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Injectable()
export class GetAll__ProjectName__sPrismaRepository implements GetAll__ProjectName__sPort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  async getAll(): Promise<__ProjectName__Entity[]> {
    const results = await this.prisma.__projectNameCamel__.findMany()
    return results.map((result) => this.mapper.fromPrimitives(result))
  }
}
