import { ICommand } from '@nestjs/cqrs'

export class Delete__project_name_pascal__Command implements ICommand {
  constructor(public readonly id: string) {}
}
