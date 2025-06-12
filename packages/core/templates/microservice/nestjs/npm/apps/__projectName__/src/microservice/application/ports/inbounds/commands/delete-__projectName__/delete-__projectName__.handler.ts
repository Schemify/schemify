/**
 * Delete__ProjectName__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `Delete__ProjectName__Command`.
 *
 * Se encarga de:
 * - Verificar si el `__ProjectName__Entity` existe en el sistema
 * - Delegar su eliminación al repositorio de escritura
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `Delete__ProjectName__Command` con el ID del recurso
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler consulta si el recurso existe
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, ejecuta `delete__ProjectName__Port.delete(id)`
 *
 * Dependencias:
 * - `Delete__ProjectName__Port`: contrato de persistencia de escritura
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Delete__ProjectName__Command } from './delete-__projectName__.command'

import { Delete__ProjectName__Port } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-command-ports'
import { Get__ProjectName__ByIdPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

@CommandHandler(Delete__ProjectName__Command)
export class Delete__ProjectName__Handler
  implements ICommandHandler<Delete__ProjectName__Command>
{
  constructor(
    @Inject(Delete__ProjectName__Port)
    private readonly delete__ProjectName__Port: Delete__ProjectName__Port,

    @Inject(Get__ProjectName__ByIdPort)
    private readonly get__ProjectName__ByIdPort: Get__ProjectName__ByIdPort
  ) {}

  /**
   * Ejecuta el comando de eliminación.
   *
   * @param command Comando con el ID del agregado a eliminar
   * @throws NotFoundException si el recurso no existe
   */
  async execute(command: Delete__ProjectName__Command): Promise<void> {
    const entity = await this.get__ProjectName__ByIdPort.getById(command.id)

    if (!entity) {
      throw new NotFoundException(
        `__ProjectName__ with id ${command.id} not found`
      )
    }

    await this.delete__ProjectName__Port.delete(command.id)
  }
}
