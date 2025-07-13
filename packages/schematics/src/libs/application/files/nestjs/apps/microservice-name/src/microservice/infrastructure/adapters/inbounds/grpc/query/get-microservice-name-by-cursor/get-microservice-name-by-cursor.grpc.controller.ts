/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { microservice_name } from '@proto'

import { CursorResult } from '@microserviceName/libs/shared/interfaces/pagination/cursor-result.interface'

import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

import { GetMicroserviceNameByCursorQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

@Controller('MicroserviceNameService')
export class GetMicroserviceNameByCursorGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MicroserviceNameMapper
  ) {}

  @GrpcMethod(
    'MicroserviceNameService',
    'getMicroserviceNameByCursor'
  )
  async getMicroserviceNameByCursor(
    request: microservice_name.CursorPaginationRequest
  ): Promise<microservice_name.CursorPaginatedMicroserviceName> {
    const query = new GetMicroserviceNameByCursorQuery({
      afterId: request.afterId,
      limit: request.limit
    })

    const { items, nextCursor, hasMore } = await this.queryBus.execute<
      GetMicroserviceNameByCursorQuery,
      CursorResult<MicroserviceNameEntity>
    >(query)

    return {
      MicroserviceName: items.map((e) => this.mapper.entityToProto(e)),
      nextCursor: nextCursor ?? '',
      hasMore
    }
  }
}
