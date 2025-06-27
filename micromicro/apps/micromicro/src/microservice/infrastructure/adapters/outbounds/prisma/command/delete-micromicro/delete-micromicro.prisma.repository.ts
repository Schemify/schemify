/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@micromicro/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { DeleteMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'

@Injectable()
export class DeleteMicromicroPrismaRepository
  implements DeleteMicromicroPort
{
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    await this.prisma.micromicro.delete({ where: { id } })
  }
}
