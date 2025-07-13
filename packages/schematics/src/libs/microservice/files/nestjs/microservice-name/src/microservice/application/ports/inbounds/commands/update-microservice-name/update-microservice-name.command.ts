/**
 * UpdateMicroserviceNameCommand
 * -----------------------------------------------------------------------------
 * Comando que solicita la actualización de uno o más campos del `MicroserviceNameEntity`.
 *
 * Este comando es procesado por el `UpdateMicroserviceNameHandler`, quien valida la existencia
 * del recurso y aplica los cambios permitidos usando los métodos del dominio.
 *
 * Se permite actualizar uno o ambos campos (`name` y `description`).
 */

import { ICommand } from '@nestjs/cqrs'

export class UpdateMicroserviceNameCommand implements ICommand {
  constructor(
    /**
     * ID del MicroserviceName a modificar
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
