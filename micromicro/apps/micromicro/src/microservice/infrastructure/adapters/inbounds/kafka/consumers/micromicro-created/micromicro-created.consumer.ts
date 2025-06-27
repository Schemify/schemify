/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'

import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { Envelope } from '@micromicro/libs/shared/events/event-envelope'

import { GetMicromicroByIdQuery } from '@micromicro/microservice/application/ports/inbounds/queries'

@Controller()
export class MicromicroCreatedConsumer {
  constructor(private readonly queryBus: QueryBus) {}

  @EventPattern('micromicro.created')
  async handle(@Payload() env: Envelope) {
    try {
      if (env.type !== 'MicromicroCreated' || env.version !== 1)
        return

      const evt = env.payload as MicromicroCreatedEvent

      const query = new GetMicromicroByIdQuery({
        id: evt.micromicro.id
      })

      const event = await this.queryBus.execute(query)

      console.log('✅ Ejemplo recuperado por ID:', event)
    } catch (error) {
      console.error('❌ Error al decodificar el mensaje:', error)
      // Aquí podrías lanzar un error o manejarlo según tu lógica de negocio
    }
  }
}
