import { __project_name_pascal__DescriptionUpdatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-description-updated.event'

export abstract class __project_name_camel__DescriptionUpdatedPublisherPort {
  abstract publish(
    event: __project_name_pascal__DescriptionUpdatedEvent
  ): Promise<void>
}
