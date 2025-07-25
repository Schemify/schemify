/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_camel__ } from '@proto'

import { CursorResult } from '@__project_name_camel__/libs/shared/interfaces/pagination/cursor-result.interface'

import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

import { Get__project_name_pascal__ByCursorQuery } from '@__project_name_camel__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Controller('__project_name_pascal__Service')
export class Get__project_name_pascal__ByCursorGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  @GrpcMethod(
    '__project_name_pascal__Service',
    'get__project_name_pascal__ByCursor'
  )
  async get__project_name_pascal__ByCursor(
    request: __project_name_camel__.CursorPaginationRequest
  ): Promise<__project_name_camel__.CursorPaginated__project_name_pascal__> {
    const query = new Get__project_name_pascal__ByCursorQuery({
      afterId: request.afterId,
      limit: request.limit
    })

    const { items, nextCursor, hasMore } = await this.queryBus.execute<
      Get__project_name_pascal__ByCursorQuery,
      CursorResult<__project_name_pascal__Entity>
    >(query)

    return {
      __project_name_camel__: items.map((e) => this.mapper.entityToProto(e)),
      nextCursor: nextCursor ?? '',
      hasMore
    }
  }
}
