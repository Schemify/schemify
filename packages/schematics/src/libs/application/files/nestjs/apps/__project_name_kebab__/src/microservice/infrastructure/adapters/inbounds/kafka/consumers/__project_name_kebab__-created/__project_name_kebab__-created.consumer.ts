import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { QueryBus } from '@nestjs/cqrs'

import { __project_name_snake___events } from '@proto'
import { Envelope } from 'apps/__project_name_kebab__/src/libs/shared/events/event-envelope'
import { Get__project_name_camel__ByIdQuery } from 'apps/__project_name_kebab__/src/microservice/application/ports/inbounds/queries'
import { PrintConsoleUseCase } from 'apps/__project_name_kebab__/src/microservice/application/use-cases/print-console/print-console.use-case'

@Controller()
export class __project_name_camel__CreatedConsumer {
  private readonly logger = new Logger(
    __project_name_camel__CreatedConsumer.name
  )

  constructor(
    private readonly queryBus: QueryBus,
    private readonly printConsoleUseCase: PrintConsoleUseCase
  ) {}

  @EventPattern('__project_name_camel__.created')
  async handle(@Payload() envelope: Envelope) {
    if (
      envelope.type !== '__project_name_camel__Created' ||
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
        envelope.payload as __project_name_snake___events.__project_name_camel__CreatedEvent

      const query = new Get__project_name_camel__ByIdQuery({ id: event.id })

      const result = await this.queryBus.execute(query)

      await this.printConsoleUseCase.execute(result)
    } catch (error) {
      this.logger.error(
        '❌ Failed to process __project_name_camel__CreatedEvent',
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
