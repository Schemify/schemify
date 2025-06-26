import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { __ProjectName__CreatedEvent } from '@__projectName__/microservice/domain/events/__projectName__-created.event'
import { Print__ProjectName__InfoUseCase } from '@__projectName__/microservice/application/use-cases/messaging/kafka/print-__projectName__-info.use-case'

@EventsHandler(__ProjectName__CreatedEvent)
export class __ProjectName__CreatedEventHandler
  implements IEventHandler<__ProjectName__CreatedEvent>
{
  constructor(private readonly useCase: Print__ProjectName__InfoUseCase) {}

  async handle(event: __ProjectName__CreatedEvent): Promise<void> {
    await this.useCase.execute(event)
  }
}
