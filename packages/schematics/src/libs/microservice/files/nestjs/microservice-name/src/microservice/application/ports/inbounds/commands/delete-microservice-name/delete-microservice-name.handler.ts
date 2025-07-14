/**
 * DeleteMicroserviceNameHandler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `DeleteMicroserviceNameCommand`.
 *
 * Se encarga de:
 * - Verificar si el `MicroserviceNameEntity` existe en el sistema
 * - Delegar su eliminación al repositorio de escritura
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `DeleteMicroserviceNameCommand` con el ID del recurso
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler consulta si el recurso existe
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, ejecuta `deleteMicroserviceNamePort.delete(id)`
 *
 * Dependencias:
 * - `DeleteMicroserviceNamePort`: contrato de persistencia de escritura
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { DeleteMicroserviceNameCommand } from './delete-microserviceName.command'

import { DeleteMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-command-ports'
import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'

@CommandHandler(DeleteMicroserviceNameCommand)
export class DeleteMicroserviceNameHandler
  implements ICommandHandler<DeleteMicroserviceNameCommand>
{
  constructor(
    @Inject(DeleteMicroserviceNamePort)
    private readonly deleteMicroserviceNamePort: DeleteMicroserviceNamePort,

    @Inject(GetMicroserviceNameByIdPort)
    private readonly getMicroserviceNameByIdPort: GetMicroserviceNameByIdPort
  ) {}

  /**
   * Ejecuta el comando de eliminación.
   *
   * @param command Comando con el ID del agregado a eliminar
   * @throws NotFoundException si el recurso no existe
   */
  async execute(command: DeleteMicroserviceNameCommand): Promise<void> {
    const entity = await this.getMicroserviceNameByIdPort.getById(command.id)

    if (!entity) {
      throw new NotFoundException(
        `MicroserviceName with id ${command.id} not found`
      )
    }

    await this.deleteMicroserviceNamePort.delete(command.id)
  }
}
