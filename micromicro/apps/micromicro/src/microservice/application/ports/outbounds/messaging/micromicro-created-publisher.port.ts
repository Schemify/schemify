import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'

export abstract class MicromicroCreatedPublisherPort {
  abstract publish(event: MicromicroCreatedEvent): Promise<void>
}
