/**
 * UpdateMicroserviceNameHandler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `UpdateMicroserviceNameCommand`.
 *
 * Se encarga de:
 * - Verificar que el `MicroserviceNameEntity` existe en el sistema
 * - Aplicar actualizaciones parciales mediante métodos del dominio
 * - Guardar los cambios usando el repositorio de escritura
 * - Emitir eventos si corresponde (`rename`, `updateDescription`)
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `UpdateMicroserviceNameCommand` con uno o más campos a actualizar
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler busca la entidad por ID
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, llama a los métodos mutadores del dominio
 * 6. Guarda los cambios en el repositorio
 * 7. Ejecuta `entity.commit()` para publicar los eventos
 *
 * Dependencias:
 * - `GetMicroserviceNameByIdPort`: para verificar existencia (solo lectura)
 * - `UpdateMicroserviceNamePort`: para persistir el resultado modificado
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { UpdateMicroserviceNameCommand } from './update-microservice-name.command'

import { MicroserviceNameEntity } from '@microserviceName/microservice/domain/entities/microservice-name.entity'

import { GetMicroserviceNameByIdPort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-query-ports'
import { UpdateMicroserviceNamePort } from '@microserviceName/microservice/application/ports/outbounds/repositories/microservice-name-command-ports'
@CommandHandler(UpdateMicroserviceNameCommand)
export class UpdateMicroserviceNameHandler
  implements ICommandHandler<UpdateMicroserviceNameCommand>
{
  constructor(
    @Inject(GetMicroserviceNameByIdPort)
    private readonly getMicroserviceNameByIdPort: GetMicroserviceNameByIdPort,
    @Inject(UpdateMicroserviceNamePort)
    private readonly updateMicroserviceNamePort: UpdateMicroserviceNamePort
  ) {}

  /**
   * Ejecuta el comando de actualización.
   *
   * @param command Datos de entrada para actualizar el MicroserviceName
   * @returns La entidad actualizada
   * @throws NotFoundException si el recurso no existe
   */
  async execute(
    command: UpdateMicroserviceNameCommand
  ): Promise<MicroserviceNameEntity> {
    const microserviceName =
      await this.getMicroserviceNameByIdPort.getById(command.id)

    if (!microserviceName) {
      throw new NotFoundException(
        `MicroserviceName with id ${command.id} not found`
      )
    }

    // ✅ Usamos el método de actualización centralizado en el agregado
    microserviceName.update({
      name: command.name,
      description: command.description
    })

    await this.updateMicroserviceNamePort.update(microserviceName)
    microserviceName.commit()

    return microserviceName
  }
}
