/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@__project_name_camel__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { Update__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'

@Injectable()
export class Update__project_name_pascal__PrismaRepository
  implements Update__project_name_pascal__Port
{
  constructor(private readonly prisma: PrismaService) {}

  async update(entity: __project_name_pascal__Entity): Promise<void> {
    await this.prisma.__project_name_camel__.update({
      where: { id: entity.id },
      data: {
        name: entity.props.name.value,
        description: entity.props.description?.value ?? null,
        updatedAt: entity.props.updatedAt
      }
    })
  }
}
