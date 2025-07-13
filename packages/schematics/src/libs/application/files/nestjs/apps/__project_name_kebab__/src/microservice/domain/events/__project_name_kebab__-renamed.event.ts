import { IEvent } from '@nestjs/cqrs'
import { NameValueObject } from '../value-objects/name.value-object'

export class __project_name_pascal__RenamedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly newName: NameValueObject
  ) {}
}
