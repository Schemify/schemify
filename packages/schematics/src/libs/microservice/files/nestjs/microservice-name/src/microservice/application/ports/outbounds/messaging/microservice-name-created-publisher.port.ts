import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'

export abstract class MicroserviceNameCreatedPublisherPort {
  abstract publish(event: MicroserviceNameCreatedEvent): Promise<void>
}
