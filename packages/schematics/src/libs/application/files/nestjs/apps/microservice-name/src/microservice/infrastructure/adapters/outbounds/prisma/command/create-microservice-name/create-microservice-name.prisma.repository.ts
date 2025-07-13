/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@microserviceName/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { CreateMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-command-ports'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

@Injectable()
export class CreateMicroserviceNamePrismaRepository
  implements CreateMicroserviceNamePort
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  async create(
    entity: MicroserviceNameEntity
  ): Promise<MicroserviceNameEntity> {
    const createdEntity = await this.prisma.microserviceName.create({
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
