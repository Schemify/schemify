/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@__projectName__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { Create__ProjectName__Port } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-command-ports'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Injectable()
export class Create__ProjectName__PrismaRepository
  implements Create__ProjectName__Port
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  async create(entity: __ProjectName__Entity): Promise<__ProjectName__Entity> {
    const createdEntity = await this.prisma.__projectNameCamel__.create({
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
