/**
 * Update__project_name_pascal__Handler
 * -----------------------------------------------------------------------------
 * Handler que responde al comando `Update__project_name_pascal__Command`.
 *
 * Se encarga de:
 * - Verificar que el `__project_name_pascal__Entity` existe en el sistema
 * - Aplicar actualizaciones parciales mediante métodos del dominio
 * - Guardar los cambios usando el repositorio de escritura
 * - Emitir eventos si corresponde (`rename`, `updateDescription`)
 *
 * Esta clase forma parte de la **capa de aplicación**, implementando el patrón **CQRS**.
 *
 * Flujo de ejecución:
 * 1. Se envía un `Update__project_name_pascal__Command` con uno o más campos a actualizar
 * 2. El `CommandBus` ejecuta este handler
 * 3. El handler busca la entidad por ID
 * 4. Si no existe, lanza `NotFoundException`
 * 5. Si existe, llama a los métodos mutadores del dominio
 * 6. Guarda los cambios en el repositorio
 * 7. Ejecuta `entity.commit()` para publicar los eventos
 *
 * Dependencias:
 * - `Get__project_name_pascal__ByIdPort`: para verificar existencia (solo lectura)
 * - `Update__project_name_pascal__Port`: para persistir el resultado modificado
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject, NotFoundException } from '@nestjs/common'

import { Update__project_name_pascal__Command } from './update-__project_name_camel__.command'

import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'

import { Get__project_name_pascal__ByIdPort } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-query-ports'
import { Update__project_name_pascal__Port } from '@__project_name_camel__/microservice/application/ports/outbounds/repositories/__project_name_camel__-command-ports'
@CommandHandler(Update__project_name_pascal__Command)
export class Update__project_name_pascal__Handler
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
   * @param command Datos de entrada para actualizar el __project_name_pascal__
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
        `__project_name_pascal__ with id ${command.id} not found`
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
