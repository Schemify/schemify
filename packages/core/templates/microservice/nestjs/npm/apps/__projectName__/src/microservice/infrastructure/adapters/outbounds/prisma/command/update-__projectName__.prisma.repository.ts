/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@__projectName__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { Update__ProjectName__Port } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-command-ports'

@Injectable()
export class Update__ProjectName__PrismaRepository implements Update__ProjectName__Port {
  constructor(private readonly prisma: PrismaService) {}

  async update(entity: __ProjectName__Entity): Promise<void> {
    await this.prisma.__projectNameCamel__.update({
      where: { id: entity.id },
      data: {
        name: entity.props.name.value,
        description: entity.props.description?.value ?? null,
        updatedAt: entity.props.updatedAt
      }
    })
  }
}
