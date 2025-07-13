/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microserviceName } from '@proto'

import { UpdateMicroserviceNameCommand } from '@microserviceName/microservice/application/ports/inbounds/commands'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'

@Controller()
export class UpdateMicroserviceNameGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  @GrpcMethod('MicroserviceNameService', 'updateMicroserviceName')
  async updateMicroserviceName(
    request: microserviceName.UpdateMicroserviceNameDto
  ): Promise<microserviceName.MicroserviceName> {
    if (!request.microserviceName) {
      throw new Error('Falta el objeto microserviceName en el payload')
    }

    const props = this.mapper.protoToProps(request.microserviceName)

    const command = new UpdateMicroserviceNameCommand(
      request.id,
      props.name?.value,
      props.description?.value
    )

    const entity = await this.commandBus.execute(command)

    return this.mapper.entityToProto(entity)
  }
}
