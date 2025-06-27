/**
 * Create__project_name_pascal__Command
 * -----------------------------------------------------------------------------
 * Comando que solicita la creación de un nuevo agregado `__project_name_pascal__Entity`.
 *
 * Es procesado por el `Create__project_name_pascal__Handler`, que orquesta la lógica de creación,
 * validación y persistencia del nuevo registro.
 *
 * Los datos enviados serán transformados en ValueObjects dentro del dominio.
 */

import { ICommand } from '@nestjs/cqrs'

export class Create__project_name_pascal__Command implements ICommand {
  constructor(
    /**
     * Nombre del nuevo __project_name_pascal__ (obligatorio)
     */
    public readonly name: string,

    /**
     * Descripción opcional del __project_name_pascal__
     */
    public readonly description?: string
  ) {}
}
