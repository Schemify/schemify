/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@micromicro/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Injectable()
export class GetMicromicroByIdPrismaRepository
  implements GetMicromicroByIdPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicromicroMapper
  ) {}

  async getById(id: string): Promise<MicromicroEntity | null> {
    const result = await this.prisma.micromicro.findUnique({
      where: { id }
    })

    if (!result) return null

    return this.mapper.fromPrimitives(result)
  }
}
