import { ICommand } from '@nestjs/cqrs'

export class Update__project_name_camel__Command implements ICommand {
  constructor(
    /**
     * ID del __project_name_camel__ a modificar
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
