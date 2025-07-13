/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_snake__ } from '@proto'

import { Create__project_name_camel__Command } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/commands'

import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

@Controller()
export class Create__project_name_camel__GrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod('__project_name_camel__Service', 'create__project_name_camel__')
  async create__project_name_camel__(
    request: __project_name_snake__.Create__project_name_camel__Dto
  ): Promise<__project_name_snake__.__project_name_camel__> {
    const command = new Create__project_name_camel__Command(
      request.name,
      request.description
    )

    const entity = await this.commandBus.execute<
      Create__project_name_camel__Command,
      __project_name_pascal__Entity
    >(command)

    return this.mapper.entityToProto(entity)
  }
}
