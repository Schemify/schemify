/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { __project_name_pascal__CreatedEvent } from '@__project_name_kebab__/microservice/domain/events/__project_name_kebab__-created.event'
import { __project_name_pascal__CreatedPublisherPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/messaging/__project_name_kebab__-created-publisher.port'

@Injectable()
export class Print__project_name_pascal__InfoUseCase {
  constructor(private readonly publisher: __project_name_pascal__CreatedPublisherPort) {}

  /**
   * Imprime la información del evento `__project_name_pascal__CreatedEvent` en la consola.
   *
   * @param event Evento de creación de ejemplo
   */
  async execute(event: __project_name_pascal__CreatedEvent): Promise<void> {
    await this.publisher.publish(event)
  }
}
