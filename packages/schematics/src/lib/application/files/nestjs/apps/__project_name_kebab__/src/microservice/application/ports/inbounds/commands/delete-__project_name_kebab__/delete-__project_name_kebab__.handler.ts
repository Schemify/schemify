/**
 * Delete__project_name_pascal__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `Delete__project_name_pascal__Command`.
 *
 * Se encarga de:
 * - Verificar si el `__project_name_pascal__Entity` existe en el sistema
 * - Delegar su eliminación al repositorio de escritura
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `Delete__project_name_pascal__Command` con el ID del recurso
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler consulta si el recurso existe
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, ejecuta `delete__project_name_pascal__Port.delete(id)`
 *
 * Dependencias:
 * - `Delete__project_name_pascal__Port`: contrato de persistencia de escritura
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Delete__project_name_pascal__Command } from './delete-__project_name_camel__.command'

import { Delete__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-command-ports'
import { Get__project_name_pascal__ByIdPort } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-query-ports'

@CommandHandler(Delete__project_name_pascal__Command)
export class Delete__project_name_pascal__Handler
  implements ICommandHandler<Delete__project_name_pascal__Command>
{
  constructor(
    @Inject(Delete__project_name_pascal__Port)
    private readonly delete__project_name_pascal__Port: Delete__project_name_pascal__Port,

    @Inject(Get__project_name_pascal__ByIdPort)
    private readonly get__project_name_pascal__ByIdPort: Get__project_name_pascal__ByIdPort
  ) {}

  /**
   * Ejecuta el comando de eliminación.
   *
   * @param command Comando con el ID del agregado a eliminar
   * @throws NotFoundException si el recurso no existe
   */
  async execute(command: Delete__project_name_pascal__Command): Promise<void> {
    const entity = await this.get__project_name_pascal__ByIdPort.getById(
      command.id
    )

    if (!entity) {
      throw new NotFoundException(
        `__project_name_pascal__ with id ${command.id} not found`
      )
    }

    await this.delete__project_name_pascal__Port.delete(command.id)
  }
}
