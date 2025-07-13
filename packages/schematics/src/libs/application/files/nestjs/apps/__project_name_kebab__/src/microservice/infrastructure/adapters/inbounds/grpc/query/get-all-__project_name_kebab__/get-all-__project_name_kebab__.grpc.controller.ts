/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_snake__ } from '@proto'

import { GetAll__project_name_camel__Query } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Controller()
export class GetAll__project_name_camel__GrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod('__project_name_camel__Service', 'getAll__project_name_camel__')
  async getAll__project_name_camel__(): Promise<__project_name_snake__.__project_name_camel__List> {
    const entities = await this.queryBus.execute<
      GetAll__project_name_camel__Query,
      __project_name_pascal__Entity[]
    >(new GetAll__project_name_camel__Query())

    return {
      __project_name_camel__: entities.map((entity) =>
        this.mapper.entityToProto(entity)
      )
    }
  }
}
