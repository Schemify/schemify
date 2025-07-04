/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_camel__ } from '@proto'

import { Update__project_name_pascal__Command } from '@__project_name_camel__/microservice/application/ports/inbounds/commands'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Controller()
export class Update__project_name_pascal__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod('__project_name_pascal__Service', 'update__project_name_pascal__')
  async update__project_name_pascal__(
    request: __project_name_camel__.Update__project_name_pascal__Dto
  ): Promise<__project_name_camel__.__project_name_pascal__> {
    if (!request.__project_name_camel__) {
      throw new Error('Falta el objeto __project_name_camel__ en el payload')
    }

    const props = this.mapper.protoToProps(request.__project_name_camel__)

    const command = new Update__project_name_pascal__Command(
      request.id,
      props.name?.value,
      props.description?.value
    )

    const entity = await this.commandBus.execute(command)

    return this.mapper.entityToProto(entity)
  }
}
