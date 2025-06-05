/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'

import { __ProjectName__CreatedEvent } from '@__projectName__/microservice/domain/events/__projectName__-created.event'
import { Envelope } from '@__projectName__/libs/shared/events/event-envelope'


import { Get__ProjectName__ByIdQuery } from '@__projectName__/microservice/application/ports/inbounds/queries'

@Controller()
export class __ProjectName__CreatedConsumer {
  constructor(private readonly queryBus: QueryBus) {}

  @EventPattern('__projectName__.created')
  async handle(@Payload() env: Envelope) {
    try {
      if (env.type !== '__ProjectName__Created' || env.version !== 1) return

      const evt = env.payload as __ProjectName__CreatedEvent

      const query = new Get__ProjectName__ByIdQuery({ id: evt.__projectNameCamel__.id })

      const event = await this.queryBus.execute(query)

      console.log('✅ Ejemplo recuperado por ID:', event)
    } catch (error) {
      console.error('❌ Error al decodificar el mensaje:', error)
      // Aquí podrías lanzar un error o manejarlo según tu lógica de negocio
    }
  }
}
