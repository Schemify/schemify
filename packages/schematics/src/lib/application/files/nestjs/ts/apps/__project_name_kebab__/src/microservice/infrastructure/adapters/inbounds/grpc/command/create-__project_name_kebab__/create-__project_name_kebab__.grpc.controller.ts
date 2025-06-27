/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_camel__ } from '@proto'

import { Create__project_name_pascal__Command } from '@__project_name_camel__/microservice/application/ports/inbounds/commands'

import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

@Controller()
export class Create__project_name_pascal__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod('__project_name_pascal__Service', 'create__project_name_pascal__')
  async create__project_name_pascal__(
    request: __project_name_camel__.Create__project_name_pascal__Dto
  ): Promise<__project_name_camel__.__project_name_pascal__> {
    const command = new Create__project_name_pascal__Command(
      request.name,
      request.description
    )

    const entity = await this.commandBus.execute<
      Create__project_name_pascal__Command,
      __project_name_pascal__Entity
    >(command)

    return this.mapper.entityToProto(entity)
  }
}
