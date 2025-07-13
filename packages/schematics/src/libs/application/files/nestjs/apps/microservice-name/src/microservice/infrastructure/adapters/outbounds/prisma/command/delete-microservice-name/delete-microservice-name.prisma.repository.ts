/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@microserviceName/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { DeleteMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-command-ports'

@Injectable()
export class DeleteMicroserviceNamePrismaRepository
  implements DeleteMicroserviceNamePort
{
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.microserviceName.delete({ where: { id } })
  }
}
