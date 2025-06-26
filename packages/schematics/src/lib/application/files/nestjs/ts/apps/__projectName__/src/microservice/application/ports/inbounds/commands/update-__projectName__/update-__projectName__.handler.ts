/**
 * Update__ProjectName__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `Update__ProjectName__Command`.
 *
 * Se encarga de:
 * - Verificar que el `__ProjectName__Entity` existe en el sistema
 * - Aplicar actualizaciones parciales mediante métodos del dominio
 * - Guardar los cambios usando el repositorio de escritura
 * - Emitir eventos si corresponde (`rename`, `updateDescription`)
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `Update__ProjectName__Command` con uno o más campos a actualizar
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler busca la entidad por ID
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, llama a los métodos mutadores del dominio
 * 6. Guarda los cambios en el repositorio
 * 7. Ejecuta `entity.commit()` para publicar los eventos
 *
 * Dependencias:
 * - `Get__ProjectName__ByIdPort`: para verificar existencia (solo lectura)
 * - `Update__ProjectName__Port`: para persistir el resultado modificado
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Update__ProjectName__Command } from './update-__projectName__.command'

import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'

import { Get__ProjectName__ByIdPort } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'
import { Update__ProjectName__Port } from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-command-ports'
@CommandHandler(Update__ProjectName__Command)
export class Update__ProjectName__Handler
  implements ICommandHandler<Update__ProjectName__Command>
{
  constructor(
    @Inject(Get__ProjectName__ByIdPort)
    private readonly get__ProjectName__ByIdPort: Get__ProjectName__ByIdPort,
    @Inject(Update__ProjectName__Port)
    private readonly update__ProjectName__Port: Update__ProjectName__Port
  ) {}

  /**
   * Ejecuta el comando de actualización.
   *
   * @param command Datos de entrada para actualizar el __ProjectName__
   * @returns La entidad actualizada
   * @throws NotFoundException si el recurso no existe
   */
  async execute(
    command: Update__ProjectName__Command
  ): Promise<__ProjectName__Entity> {
    const __projectNameCamel__ = await this.get__ProjectName__ByIdPort.getById(
      command.id
    )

    if (!__projectNameCamel__) {
      throw new NotFoundException(
        `__ProjectName__ with id ${command.id} not found`
      )
    }

    // ✅ Usamos el método de actualización centralizado en el agregado
    __projectNameCamel__.update({
      name: command.name,
      description: command.description
    })

    await this.update__ProjectName__Port.update(__projectNameCamel__)
    __projectNameCamel__.commit()

    return __projectNameCamel__
  }
}
