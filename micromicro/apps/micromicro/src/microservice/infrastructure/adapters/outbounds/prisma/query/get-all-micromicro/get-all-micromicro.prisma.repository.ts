/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@micromicro/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetAllMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Injectable()
export class GetAllMicromicroPrismaRepository
  implements GetAllMicromicroPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicromicroMapper
  ) {}

  async getAll(): Promise<MicromicroEntity[]> {
    const results = await this.prisma.micromicro.findMany()
    return results.map((result) => this.mapper.fromPrimitives(result))
  }
}
