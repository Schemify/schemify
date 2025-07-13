import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Delete__project_name_pascal__Command } from './delete-__project_name_kebab__.command'

import { Delete__project_name_pascal__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'
import { Get__project_name_pascal__ByIdPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

@CommandHandler(Delete__project_name_pascal__Command)
export class Delete__project_name_camel__Handler
  implements ICommandHandler<Delete__project_name_pascal__Command>
{
  constructor(
    @Inject(Delete__project_name_pascal__Port)
    private readonly delete__project_name_pascal__Port: Delete__project_name_pascal__Port,

    @Inject(Get__project_name_pascal__ByIdPort)
    private readonly get__project_name_camel__ByIdPort: Get__project_name_pascal__ByIdPort
  ) {}

  async execute(command: Delete__project_name_pascal__Command): Promise<void> {
    const entity = await this.get__project_name_camel__ByIdPort.getById(
      command.id
    )

    if (!entity) {
      throw new NotFoundException(
        `__project_name_camel__ with id ${command.id} not found`
      )
    }

    await this.delete__project_name_pascal__Port.delete(command.id)
  }
}
