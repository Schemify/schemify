import { __project_name_pascal__CreatedEvent } from '@__project_name_kebab__/microservice/domain/events/__project_name_kebab__-created.event'

export abstract class __project_name_pascal__CreatedPublisherPort {
  abstract publish(event: __project_name_pascal__CreatedEvent): Promise<void>
}
