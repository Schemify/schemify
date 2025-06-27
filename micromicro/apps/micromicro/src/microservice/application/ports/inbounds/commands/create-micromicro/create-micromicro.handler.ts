import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { CreateMicromicroCommand } from './create-micromicro.command'

import { MicromicroEntity } from '@micromicro/microservice//domain/entities/micromicro.entity'

import { CreateMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'

@CommandHandler(CreateMicromicroCommand)
export class CreateMicromicroHandler
  implements ICommandHandler<CreateMicromicroCommand>
{
  constructor(
    @Inject(CreateMicromicroPort)
    private readonly createMicromicroPort: CreateMicromicroPort,
    private readonly publisher: EventPublisher
  ) {}

  /**
   * Ejecuta el comando creando un nuevo agregado en el dominio.
   *
   * @param command Datos del nuevo ejemplo
   * @returns Instancia del agregado `MicromicroEntity` creado
   */
  async execute(command: CreateMicromicroCommand): Promise<MicromicroEntity> {
    const entity = MicromicroEntity.create({
      name: command.name,
      description: command.description
    })

    const merged = this.publisher.mergeObjectContext(entity)
    await this.createMicromicroPort.create(merged)
    merged.commit()

    return entity
  }
}
