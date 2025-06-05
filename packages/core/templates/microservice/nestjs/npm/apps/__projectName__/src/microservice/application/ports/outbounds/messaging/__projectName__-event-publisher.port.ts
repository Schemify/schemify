import { __ProjectName__CreatedEvent } from '@__projectName__/microservice/domain/events/__projectName__-created.event'

export abstract class __ProjectName__EventPublisherPort {
  abstract publishCreatedEvent(event: __ProjectName__CreatedEvent): Promise<void>
}
