/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { MicroserviceNameCreatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microserviceName-created-publisher.port'

@Injectable()
export class PrintMicroserviceNameInfoUseCase {
  constructor(
    private readonly publisher: MicroserviceNameCreatedPublisherPort
  ) {}

  /**
   * Imprime la información del evento `MicroserviceNameCreatedEvent` en la consola.
   *
   * @param event Evento de creación de ejemplo
   */
  async execute(event: MicroserviceNameCreatedEvent): Promise<void> {
    await this.publisher.publish(event)
  }
}
