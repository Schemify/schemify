import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'
import { PrintMicromicroInfoUseCase } from '@micromicro/microservice/application/use-cases/messaging/kafka/print-micromicro-info.use-case'

@EventsHandler(MicromicroCreatedEvent)
export class MicromicroCreatedEventHandler
  implements IEventHandler<MicromicroCreatedEvent>
{
  constructor(
    private readonly useCase: PrintMicromicroInfoUseCase
  ) {}

  async handle(event: MicromicroCreatedEvent): Promise<void> {
    await this.useCase.execute(event)
  }
}
