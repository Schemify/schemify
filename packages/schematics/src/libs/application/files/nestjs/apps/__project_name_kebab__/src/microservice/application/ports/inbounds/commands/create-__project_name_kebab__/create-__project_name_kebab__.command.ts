import { ICommand } from '@nestjs/cqrs'

export class Create__project_name_pascal__Command implements ICommand {
  constructor(
    public readonly name: string,

    public readonly description?: string
  ) {}
}
