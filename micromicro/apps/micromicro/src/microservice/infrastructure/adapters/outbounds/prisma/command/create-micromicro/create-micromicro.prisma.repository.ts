/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@micromicro/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { CreateMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Injectable()
export class CreateMicromicroPrismaRepository
  implements CreateMicromicroPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicromicroMapper
  ) {}

  async create(
    entity: MicromicroEntity
  ): Promise<MicromicroEntity> {
    const createdEntity = await this.prisma.micromicro.create({
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
