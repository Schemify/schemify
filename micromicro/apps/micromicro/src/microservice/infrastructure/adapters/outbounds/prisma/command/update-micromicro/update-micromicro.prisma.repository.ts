/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@micromicro/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { UpdateMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'

@Injectable()
export class UpdateMicromicroPrismaRepository
  implements UpdateMicromicroPort
{
  constructor(private readonly prisma: PrismaService) {}

  async update(entity: MicromicroEntity): Promise<void> {
    await this.prisma.micromicro.update({
      where: { id: entity.id },
      data: {
        name: entity.props.name.value,
        description: entity.props.description?.value ?? null,
        updatedAt: entity.props.updatedAt
      }
    })
  }
}
