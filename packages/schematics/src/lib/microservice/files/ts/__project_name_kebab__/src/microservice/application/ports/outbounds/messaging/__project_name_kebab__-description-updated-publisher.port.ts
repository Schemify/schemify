import { __project_name_pascal__DescriptionUpdatedEvent } from '@__project_name_camel__/microservice/domain/events/__project_name_camel__-description-updated.event'

export abstract class __project_name_pascal__DescriptionUpdatedPublisherPort {
  abstract publish(
    event: __project_name_pascal__DescriptionUpdatedEvent
  ): Promise<void>
}
