/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { MicromicroCreatedPublisherPort } from '@micromicro/microservice/application/ports/outbounds/messaging/micromicro-created-publisher.port'

@Injectable()
export class PrintMicromicroInfoUseCase {
  constructor(
    private readonly publisher: MicromicroCreatedPublisherPort
  ) {}

  /**
   * Imprime la información del evento `MicromicroCreatedEvent` en la consola.
   *
   * @param event Evento de creación de ejemplo
   */
  async execute(event: MicromicroCreatedEvent): Promise<void> {
    await this.publisher.publish(event)
  }
}
