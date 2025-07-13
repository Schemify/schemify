import { __project_name_pascal__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'

export abstract class __project_name_pascal__CreatedPublisherPort {
  abstract publish(event: __project_name_pascal__CreatedEvent): Promise<void>
}
