import { MicroserviceNameDescriptionUpdatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-description-updated.event'

export abstract class MicroserviceNameDescriptionUpdatedPublisherPort {
  abstract publish(
    event: MicroserviceNameDescriptionUpdatedEvent
  ): Promise<void>
}
