import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'

import { microservice_name_events } from '@proto'
import { Envelope } from '@microserviceName/libs/shared/events/event-envelope'
import { GetMicroserviceNameByIdQuery } from '@microserviceName/microservice/application/ports/inbounds/queries'
import { PrintConsoleUseCase } from '@microserviceName/microservice/application/use-cases/print-console/print-console.use-case'

@Controller()
export class MicroserviceNameCreatedConsumer {
  private readonly logger = new Logger(
    MicroserviceNameCreatedConsumer.name
  )

  constructor(
    private readonly queryBus: QueryBus,
    private readonly printConsoleUseCase: PrintConsoleUseCase
  ) {}

  @EventPattern('microserviceName.created')
  async handle(@Payload() envelope: Envelope) {
    if (
      envelope.type !== 'MicroserviceNameCreated' ||
      envelope.version !== 1
    ) {
      this.logger.warn(
        `Event ignored: type=${envelope.type}, version=${envelope.version}`
      )
      return
    }

    if (!envelope.payload) {
      this.logger.error('Empty or invalid payload in Envelope')
      return
    }

    try {
      const event =
        envelope.payload as microservice_name_events.MicroserviceNameCreatedEvent

      const query = new GetMicroserviceNameByIdQuery({ id: event.id })

      const result = await this.queryBus.execute(query)

      await this.printConsoleUseCase.execute(result)
    } catch (error) {
      this.logger.error(
        '❌ Failed to process MicroserviceNameCreatedEvent',
        {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          envelope: JSON.stringify(envelope)
        }
      )
      // Optional: rethrow, log to observability system, send to DLQ, etc.
    }
  }
}
