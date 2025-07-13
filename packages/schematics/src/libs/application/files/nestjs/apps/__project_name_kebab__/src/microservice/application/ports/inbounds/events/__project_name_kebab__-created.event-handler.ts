import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { __project_name_pascal__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'

import { __project_name_pascal__CreatedPublisherPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/messaging/__project_name_kebab__-created-publisher.port'

@EventsHandler(__project_name_pascal__CreatedEvent)
export class __project_name_pascal__CreatedEventHandler
  implements IEventHandler<__project_name_pascal__CreatedEvent>
{
  constructor(
    private readonly project_name_camel: __project_name_pascal__CreatedPublisherPort
  ) {}

  async handle(event: __project_name_pascal__CreatedEvent): Promise<void> {
    await this.project_name_camel.publish(event)
  }
}
