import { Injectable } from '@nestjs/common'

import { __ProjectName__CreatedEvent } from '@__projectName__/microservice/domain/events/__projectName__-created.event'
import { __ProjectName__EventPublisherPort } from '@__projectName__/microservice/application/ports/outbounds/messaging/__projectName__-event-publisher.port'

@Injectable()
export class Print__ProjectName__InfoUseCase {
  constructor(private readonly publisher: __ProjectName__EventPublisherPort) {}

  /**
   * Imprime la información del evento `__ProjectName__CreatedEvent` en la consola.
   *
   * @param event Evento de creación de ejemplo
   */
  async execute(event: __ProjectName__CreatedEvent): Promise<void> {
    await this.publisher.publishCreatedEvent(event)
  }
}
