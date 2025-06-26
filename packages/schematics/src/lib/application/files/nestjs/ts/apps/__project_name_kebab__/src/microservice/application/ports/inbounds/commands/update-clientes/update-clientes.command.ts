/**
 * Update__project_name_pascal__Command
 * -----------------------------------------------------------------------------
 * Comando que solicita la actualización de uno o más campos del `__project_name_pascal__Entity`.
 *
 * Este comando es procesado por el `Update__project_name_pascal__Handler`, quien valida la existencia
 * del recurso y aplica los cambios permitidos usando los métodos del dominio.
 *
 * Se permite actualizar uno o ambos campos (`name` y `description`).
 */

import { ICommand } from '@nestjs/cqrs'

export class Update__project_name_pascal__Command implements ICommand {
  constructor(
    /**
     * ID del __project_name_pascal__ a modificar
     */
    public readonly id: string,

    /**
     * Nuevo nombre (opcional)
     */
    public readonly name?: string,

    /**
     * Nueva descripción (opcional)
     */
    public readonly description?: string
  ) {}
}
