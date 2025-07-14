import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'
import { PrintMicroserviceNameInfoUseCase } from '@microserviceName/microservice/application/use-cases/messaging/kafka/print-microserviceName-info.use-case'

@EventsHandler(MicroserviceNameCreatedEvent)
export class MicroserviceNameCreatedEventHandler
  implements IEventHandler<MicroserviceNameCreatedEvent>
{
  constructor(private readonly useCase: PrintMicroserviceNameInfoUseCase) {}

  async handle(event: MicroserviceNameCreatedEvent): Promise<void> {
    await this.useCase.execute(event)
  }
}
