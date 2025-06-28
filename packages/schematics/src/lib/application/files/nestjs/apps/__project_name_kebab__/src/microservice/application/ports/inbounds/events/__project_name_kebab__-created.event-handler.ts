import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { __project_name_pascal__CreatedEvent } from '@__project_name_camel__/microservice/domain/events/__project_name_camel__-created.event'
import { Print__project_name_pascal__InfoUseCase } from '@__project_name_camel__/microservice/application/use-cases/messaging/kafka/print-__project_name_camel__-info.use-case'

@EventsHandler(__project_name_pascal__CreatedEvent)
export class __project_name_pascal__CreatedEventHandler
  implements IEventHandler<__project_name_pascal__CreatedEvent>
{
  constructor(
    private readonly useCase: Print__project_name_pascal__InfoUseCase
  ) {}

  async handle(event: __project_name_pascal__CreatedEvent): Promise<void> {
    await this.useCase.execute(event)
  }
}
