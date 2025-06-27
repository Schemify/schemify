import { ICommand } from '@nestjs/cqrs'

export class CreateMicromicroCommand implements ICommand {
  constructor(
    /**
     * Nombre del nuevo Micromicro (obligatorio)
     */
    public readonly name: string,

    /**
     * Descripción opcional del Micromicro
     */
    public readonly description?: string
  ) {}
}
