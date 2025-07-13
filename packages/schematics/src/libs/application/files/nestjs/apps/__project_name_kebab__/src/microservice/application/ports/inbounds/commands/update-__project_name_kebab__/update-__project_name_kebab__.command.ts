import { ICommand } from '@nestjs/cqrs'

export class Update__project_name_pascal__Command implements ICommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string
  ) {}
}
