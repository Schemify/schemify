import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { DeleteMicromicroCommand } from './delete-micromicro.command'

import { DeleteMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'
import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

@CommandHandler(DeleteMicromicroCommand)
export class DeleteMicromicroHandler
  implements ICommandHandler<DeleteMicromicroCommand>
{
  constructor(
    @Inject(DeleteMicromicroPort)
    private readonly deleteMicromicroPort: DeleteMicromicroPort,

    @Inject(GetMicromicroByIdPort)
    private readonly getMicromicroByIdPort: GetMicromicroByIdPort
  ) {}

  /**
   * Ejecuta el comando de eliminación.
   *
   * @param command Comando con el ID del agregado a eliminar
   * @throws NotFoundException si el recurso no existe
   */
  async execute(command: DeleteMicromicroCommand): Promise<void> {
    const entity = await this.getMicromicroByIdPort.getById(command.id)

    if (!entity) {
      throw new NotFoundException(`Micromicro with id ${command.id} not found`)
    }

    await this.deleteMicromicroPort.delete(command.id)
  }
}
