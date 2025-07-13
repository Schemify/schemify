import { MicroserviceNameDescriptionUpdatedEvent } from '@microserviceName/microservice/domain/events/microservice-name-description-updated.event'

export abstract class MicroserviceNameDescriptionUpdatedPublisherPort {
  abstract publish(
    event: MicroserviceNameDescriptionUpdatedEvent
  ): Promise<void>
}
