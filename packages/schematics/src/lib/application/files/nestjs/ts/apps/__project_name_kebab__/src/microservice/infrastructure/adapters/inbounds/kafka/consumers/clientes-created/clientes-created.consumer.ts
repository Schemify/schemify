/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'

import { __project_name_pascal__CreatedEvent } from '@__project_name_kebab__/microservice/domain/events/__project_name_kebab__-created.event'
import { Envelope } from '@__project_name_kebab__/libs/shared/events/event-envelope'

import { Get__project_name_pascal__ByIdQuery } from '@__project_name_kebab__/microservice/application/ports/inbounds/queries'

@Controller()
export class __project_name_pascal__CreatedConsumer {
  constructor(private readonly queryBus: QueryBus) {}

  @EventPattern('__project_name_kebab__.created')
  async handle(@Payload() env: Envelope) {
    try {
      if (env.type !== '__project_name_pascal__Created' || env.version !== 1) return

      const evt = env.payload as __project_name_pascal__CreatedEvent

      const query = new Get__project_name_pascal__ByIdQuery({
        id: evt.__project_name_kebab__.id
      })

      const event = await this.queryBus.execute(query)

      console.log('✅ Ejemplo recuperado por ID:', event)
    } catch (error) {
      console.error('❌ Error al decodificar el mensaje:', error)
      // Aquí podrías lanzar un error o manejarlo según tu lógica de negocio
    }
  }
}
