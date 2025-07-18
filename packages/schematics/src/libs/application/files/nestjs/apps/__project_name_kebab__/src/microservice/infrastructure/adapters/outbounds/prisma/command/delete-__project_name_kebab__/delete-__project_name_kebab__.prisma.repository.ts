/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Injectable } from '@nestjs/common'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@__project_name_camel__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { Delete__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'

import { __project_name_pascal__ } from '@prisma/client'

@Injectable()
export class Delete__project_name_pascal__PrismaRepository
  implements Delete__project_name_pascal__Port
{
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.__project_name_camel__.delete({ where: { id } })
  }
}
