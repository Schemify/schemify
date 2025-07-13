/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidad del dominio
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

// ✅ Adaptador de salida (infraestructura)
import { PrismaService } from '@microserviceName/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Puerto de salida (dominio)
import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-query-ports'

import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

@Injectable()
export class GetMicroserviceNameByIdPrismaRepository
  implements GetMicroserviceNameByIdPort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  async getById(id: string): Promise<MicroserviceNameEntity | null> {
    const result = await this.prisma.microserviceName.findUnique({
      where: { id }
    })

    if (!result) return null

    return this.mapper.fromPrimitives(result)
  }
}
