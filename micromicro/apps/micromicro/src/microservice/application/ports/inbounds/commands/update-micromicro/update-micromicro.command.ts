import { ICommand } from '@nestjs/cqrs'

export class UpdateMicromicroCommand implements ICommand {
  constructor(
    /**
     * ID del Micromicro a modificar
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
