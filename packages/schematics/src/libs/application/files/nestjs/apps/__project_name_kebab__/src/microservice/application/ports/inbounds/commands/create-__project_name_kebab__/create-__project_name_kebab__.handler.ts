import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Create__project_name_pascal__Command } from './create-__project_name_kebab__.command'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { Create__project_name_pascal__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'

@CommandHandler(Create__project_name_pascal__Command)
export class Create__project_name_camel__Handler
  implements ICommandHandler<Create__project_name_pascal__Command>
{
  constructor(
    @Inject(Create__project_name_pascal__Port)
    private readonly create__project_name_pascal__Port: Create__project_name_pascal__Port,
    private readonly publisher: EventPublisher
  ) {}

  async execute(
    command: Create__project_name_pascal__Command
  ): Promise<__project_name_pascal__Entity> {
    const entity = __project_name_pascal__Entity.create({
      name: command.name,
      description: command.description
    })

    const merged = this.publisher.mergeObjectContext(entity)
    await this.create__project_name_pascal__Port.create(merged)
    merged.commit()

    return entity
  }
}
