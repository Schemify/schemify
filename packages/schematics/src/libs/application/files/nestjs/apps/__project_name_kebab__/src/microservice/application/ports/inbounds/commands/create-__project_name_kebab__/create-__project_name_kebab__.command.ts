import { ICommand } from '@nestjs/cqrs'

export class Create__project_name_camel__Command implements ICommand {
  constructor(
    /**
     * Nombre del nuevo __project_name_camel__ (obligatorio)
     */
    public readonly name: string,

    /**
     * Descripción opcional del __project_name_camel__
     */
    public readonly description?: string
  ) {}
}
