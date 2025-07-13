import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Update__project_name_pascal__Command } from './update-__project_name_kebab__.command'

import { __project_name_pascal__Entity } from 'apps/__project_name_kebab__/src/microservice/domain/entities/__project_name_kebab__.entity'

import { Get__project_name_pascal__ByIdPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'
import { Update__project_name_pascal__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'
@CommandHandler(Update__project_name_pascal__Command)
export class Update__project_name_camel__Handler
  implements ICommandHandler<Update__project_name_pascal__Command>
{
  constructor(
    @Inject(Get__project_name_pascal__ByIdPort)
    private readonly get__project_name_pascal__ByIdPort: Get__project_name_pascal__ByIdPort,
    @Inject(Update__project_name_pascal__Port)
    private readonly update__project_name_pascal__Port: Update__project_name_pascal__Port
  ) {}

  /**
   * Ejecuta el comando de actualización.
   *
   * @param command Datos de entrada para actualizar el __project_name_camel__
   * @returns La entidad actualizada
   * @throws NotFoundException si el recurso no existe
   */
  async execute(
    command: Update__project_name_pascal__Command
  ): Promise<__project_name_pascal__Entity> {
    const __project_name_camel__ =
      await this.get__project_name_pascal__ByIdPort.getById(command.id)

    if (!__project_name_camel__) {
      throw new NotFoundException(
        `__project_name_camel__ with id ${command.id} not found`
      )
    }

    // ✅ Usamos el método de actualización centralizado en el agregado
    __project_name_camel__.update({
      name: command.name,
      description: command.description
    })

    await this.update__project_name_pascal__Port.update(__project_name_camel__)
    __project_name_camel__.commit()

    return __project_name_camel__
  }
}
