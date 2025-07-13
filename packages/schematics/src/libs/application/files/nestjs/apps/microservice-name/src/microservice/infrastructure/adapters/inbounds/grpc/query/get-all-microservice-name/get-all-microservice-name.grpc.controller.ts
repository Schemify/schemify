/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microservice_name } from '@proto'

import { GetAllMicroserviceNameQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

@Controller()
export class GetAllMicroserviceNameGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  @GrpcMethod('MicroserviceNameService', 'getAllMicroserviceName')
  async getAllMicroserviceName(): Promise<microservice_name.MicroserviceNameList> {
    const entities = await this.queryBus.execute<
      GetAllMicroserviceNameQuery,
      MicroserviceNameEntity[]
    >(new GetAllMicroserviceNameQuery())

    return {
      MicroserviceName: entities.map((entity) =>
        this.mapper.entityToProto(entity)
      )
    }
  }
}
