/**
 * Delete__project_name_camel__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `Delete__project_name_camel__Command`.
 *
 * Se encarga de:
 * - Verificar si el `__project_name_camel__Entity` existe en el sistema
 * - Delegar su eliminación al repositorio de escritura
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `Delete__project_name_camel__Command` con el ID del recurso
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler consulta si el recurso existe
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, ejecuta `delete__project_name_camel__Port.delete(id)`
 *
 * Dependencias:
 * - `Delete__project_name_camel__Port`: contrato de persistencia de escritura
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Delete__project_name_camel__Command } from './delete-__project_name_kebab__.command'

import { Delete__project_name_camel__Port } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'
import { Get__project_name_camel__ByIdPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

@CommandHandler(Delete__project_name_camel__Command)
export class Delete__project_name_camel__Handler
  implements ICommandHandler<Delete__project_name_camel__Command>
{
  constructor(
    @Inject(Delete__project_name_camel__Port)
    private readonly delete__project_name_camel__Port: Delete__project_name_camel__Port,

    @Inject(Get__project_name_camel__ByIdPort)
    private readonly get__project_name_camel__ByIdPort: Get__project_name_camel__ByIdPort
  ) {}

  /**
   * Ejecuta el comando de eliminación.
   *
   * @param command Comando con el ID del agregado a eliminar
   * @throws NotFoundException si el recurso no existe
   */
  async execute(command: Delete__project_name_camel__Command): Promise<void> {
    const entity = await this.get__project_name_camel__ByIdPort.getById(
      command.id
    )

    if (!entity) {
      throw new NotFoundException(
        `__project_name_camel__ with id ${command.id} not found`
      )
    }

    await this.delete__project_name_camel__Port.delete(command.id)
  }
}
