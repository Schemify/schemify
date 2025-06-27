import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { UpdateMicromicroCommand } from './update-micromicro.command'

import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'

import { GetMicromicroByIdPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'
import { UpdateMicromicroPort } from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'
@CommandHandler(UpdateMicromicroCommand)
export class UpdateMicromicroHandler
  implements ICommandHandler<UpdateMicromicroCommand>
{
  constructor(
    @Inject(GetMicromicroByIdPort)
    private readonly getMicromicroByIdPort: GetMicromicroByIdPort,
    @Inject(UpdateMicromicroPort)
    private readonly updateMicromicroPort: UpdateMicromicroPort
  ) {}

  /**
   * Ejecuta el comando de actualización.
   *
   * @param command Datos de entrada para actualizar el Micromicro
   * @returns La entidad actualizada
   * @throws NotFoundException si el recurso no existe
   */
  async execute(command: UpdateMicromicroCommand): Promise<MicromicroEntity> {
    const micromicro = await this.getMicromicroByIdPort.getById(command.id)

    if (!micromicro) {
      throw new NotFoundException(`Micromicro with id ${command.id} not found`)
    }

    // ✅ Usamos el método de actualización centralizado en el agregado
    micromicro.update({
      name: command.name,
      description: command.description
    })

    await this.updateMicromicroPort.update(micromicro)
    micromicro.commit()

    return micromicro
  }
}
