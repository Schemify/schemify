/**
 * Create__ProjectName__Command
 * -----------------------------------------------------------------------------
 * Comando que solicita la creación de un nuevo agregado `__ProjectName__Entity`.
 *
 * Es procesado por el `Create__ProjectName__Handler`, que orquesta la lógica de creación,
 * validación y persistencia del nuevo registro.
 *
 * Los datos enviados serán transformados en ValueObjects dentro del dominio.
 */

import { ICommand } from '@nestjs/cqrs'

export class Create__ProjectName__Command implements ICommand {
  constructor(
    /**
     * Nombre del nuevo __ProjectName__ (obligatorio)
     */
    public readonly name: string,

    /**
     * Descripción opcional del __ProjectName__
     */
    public readonly description?: string
  ) {}
}
