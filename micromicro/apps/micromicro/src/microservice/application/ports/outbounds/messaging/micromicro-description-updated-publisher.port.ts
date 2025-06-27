import { MicromicroDescriptionUpdatedEvent } from '@micromicro/microservice/domain/events/micromicro-description-updated.event'

export abstract class MicromicroDescriptionUpdatedPublisherPort {
  abstract publish(
    event: MicromicroDescriptionUpdatedEvent
  ): Promise<void>
}
