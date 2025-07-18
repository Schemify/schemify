/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_kebab__.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@__project_name_camel__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

import { __project_name_pascal__ } from '@prisma/client'

// ✅ Adaptador de salida (infraestructura)
import { Create__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Injectable()
export class Create__project_name_pascal__PrismaRepository
  implements Create__project_name_pascal__Port
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  async create(
    entity: __project_name_pascal__Entity
  ): Promise<__project_name_pascal__Entity> {
    const createdEntity: __project_name_pascal__ =
      await this.prisma.__project_name_camel__.create({
        data: {
          id: entity.id,
          name: entity.props.name.value,
          description: entity.props.description?.value ?? null,
          createdAt: entity.props.createdAt,
          updatedAt: entity.props.updatedAt
        }
      })

    // Convertimos el resultado a una entidad del dominio
    return this.mapper.fromPrimitives(createdEntity)
  }
}
