import { ICommand } from '@nestjs/cqrs'

export class DeleteMicromicroCommand implements ICommand {
  constructor(
    /**
     * ID del `MicromicroEntity` a eliminar.
     */
    public readonly id: string
  ) {}
}
