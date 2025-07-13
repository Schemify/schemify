/**
 * CreateMicroserviceNameCommand
 * -----------------------------------------------------------------------------
 * Comando que solicita la creación de un nuevo agregado `MicroserviceNameEntity`.
 *
 * Es procesado por el `CreateMicroserviceNameHandler`, que orquesta la lógica de creación,
 * validación y persistencia del nuevo registro.
 *
 * Los datos enviados serán transformados en ValueObjects dentro del dominio.
 */

import { ICommand } from '@nestjs/cqrs'

export class CreateMicroserviceNameCommand implements ICommand {
  constructor(
    /**
     * Nombre del nuevo MicroserviceName (obligatorio)
     */
    public readonly name: string,

    /**
     * Descripción opcional del MicroserviceName
     */
    public readonly description?: string
  ) {}
}
