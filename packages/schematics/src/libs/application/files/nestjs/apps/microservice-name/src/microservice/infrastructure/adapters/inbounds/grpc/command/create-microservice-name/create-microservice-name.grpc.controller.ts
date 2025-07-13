/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microservice_name } from '@proto'

import { CreateMicroserviceNameCommand } from '@microserviceName/microservice/application/ports/inbounds/commands'

import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

@Controller()
export class CreateMicroserviceNameGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  @GrpcMethod('MicroserviceNameService', 'createMicroserviceName')
  async createMicroserviceName(
    request: microservice_name.CreateMicroserviceNameDto
  ): Promise<microservice_name.MicroserviceName> {
    const command = new CreateMicroserviceNameCommand(
      request.name,
      request.description
    )

    const entity = await this.commandBus.execute<
      CreateMicroserviceNameCommand,
      MicroserviceNameEntity
    >(command)

    return this.mapper.entityToProto(entity)
  }
}
