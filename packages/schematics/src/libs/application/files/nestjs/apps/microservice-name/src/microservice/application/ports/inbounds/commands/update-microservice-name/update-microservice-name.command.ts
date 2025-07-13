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
