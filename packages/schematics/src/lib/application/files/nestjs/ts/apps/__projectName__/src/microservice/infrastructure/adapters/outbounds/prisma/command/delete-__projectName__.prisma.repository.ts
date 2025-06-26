/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@__projectName__/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { Delete__ProjectName__Port } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-command-ports'

@Injectable()
export class Delete__ProjectName__PrismaRepository
  implements Delete__ProjectName__Port
{
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.__projectNameCamel__.delete({ where: { id } })
  }
}
