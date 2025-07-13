import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microservice-name-created.event'

export abstract class MicroserviceNameCreatedPublisherPort {
  abstract publish(event: MicroserviceNameCreatedEvent): Promise<void>
}
