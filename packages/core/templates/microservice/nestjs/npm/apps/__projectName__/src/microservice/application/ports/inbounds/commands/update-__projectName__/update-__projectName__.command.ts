/**
 * Update__ProjectName__Command
 * -----------------------------------------------------------------------------
 * Comando que solicita la actualización de uno o más campos del `__ProjectName__Entity`.
 *
 * Este comando es procesado por el `Update__ProjectName__Handler`, quien valida la existencia
 * del recurso y aplica los cambios permitidos usando los métodos del dominio.
 *
 * Se permite actualizar uno o ambos campos (`name` y `description`).
 */

import { ICommand } from '@nestjs/cqrs'

export class Update__ProjectName__Command implements ICommand {
  constructor(
    /**
     * ID del __ProjectName__ a modificar
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
