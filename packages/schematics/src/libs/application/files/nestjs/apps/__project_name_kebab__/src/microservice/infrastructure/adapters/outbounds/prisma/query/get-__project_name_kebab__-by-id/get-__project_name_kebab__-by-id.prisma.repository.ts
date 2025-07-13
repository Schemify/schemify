/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from 'apps/__project_name_kebab__/src/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { Get__project_name_pascal__ByIdPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Injectable()
export class Get__project_name_camel__ByIdPrismaRepository
  implements Get__project_name_pascal__ByIdPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  async getById(id: string): Promise<__project_name_pascal__Entity | null> {
    const result = await this.prisma.__project_name_pascal__.findUnique({
      where: { id }
    })

    if (!result) return null

    return this.mapper.fromPrimitives(result)
  }
}
