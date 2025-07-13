/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

// Entidades del dominio
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microserviceName.entity'

// ✅ Puerto de salida (dominio)
import { PrismaService } from '@microserviceName/microservice/infrastructure/adapters/outbounds/prisma/prisma.service'

// ✅ Adaptador de salida (infraestructura)
import { UpdateMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-command-ports'

@Injectable()
export class UpdateMicroserviceNamePrismaRepository
  implements UpdateMicroserviceNamePort
{
  constructor(private readonly prisma: PrismaService) {}

  async update(entity: MicroserviceNameEntity): Promise<void> {
    await this.prisma.microserviceName.update({
      where: { id: entity.id },
      data: {
        name: entity.props.name.value,
        description: entity.props.description?.value ?? null,
        updatedAt: entity.props.updatedAt
      }
    })
  }
}
