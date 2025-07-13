/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { Envelope } from '@microserviceName/libs/shared/events/event-envelope'

import { GetMicroserviceNameByIdQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'

@Controller()
export class MicroserviceNameCreatedConsumer {
  constructor(private readonly queryBus: QueryBus) {}

  @EventPattern('microserviceName.created')
  async handle(@Payload() env: Envelope) {
    try {
      if (env.type !== 'MicroserviceNameCreated' || env.version !== 1)
        return

      const evt = env.payload as MicroserviceNameCreatedEvent

      const query = new GetMicroserviceNameByIdQuery({
        id: evt.microserviceName.id
      })

      const event = await this.queryBus.execute(query)

      console.log('✅ Ejemplo recuperado por ID:', event)
    } catch (error) {
      console.error('❌ Error al decodificar el mensaje:', error)
      // Aquí podrías lanzar un error o manejarlo según tu lógica de negocio
    }
  }
}
