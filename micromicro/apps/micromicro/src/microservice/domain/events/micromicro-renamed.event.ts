import { IEvent } from '@nestjs/cqrs'
import { NameValueObject } from '../value-objects/name.value-object'

export class MicromicroRenamedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly newName: NameValueObject
  ) {}
}
