/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@__project_name_camel__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetAll__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-query-ports'

import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Injectable()
export class GetAll__project_name_pascal__PrismaRepository
  implements GetAll__project_name_pascal__Port
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  async getAll(): Promise<__project_name_pascal__Entity[]> {
    const results = await this.prisma.__project_name_camel__.findMany()
    return results.map((result) => this.mapper.fromPrimitives(result))
  }
}
