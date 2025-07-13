import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microservice-name-created.event'

import { MicroserviceNameCreatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microservice-name-created-publisher.port'

@EventsHandler(MicroserviceNameCreatedEvent)
export class MicroserviceNameCreatedEventHandler
  implements IEventHandler<MicroserviceNameCreatedEvent>
{
  constructor(
    private readonly project_name_camel: MicroserviceNameCreatedPublisherPort
  ) {}

  async handle(event: MicroserviceNameCreatedEvent): Promise<void> {
    await this.project_name_camel.publish(event)
  }
}
