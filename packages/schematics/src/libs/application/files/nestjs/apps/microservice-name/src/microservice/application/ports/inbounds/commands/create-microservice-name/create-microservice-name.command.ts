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
