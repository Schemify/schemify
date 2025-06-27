import { IEvent } from '@nestjs/cqrs'
import { DescriptionValueObject } from '../value-objects/description.value-object'

export class MicromicroDescriptionUpdatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly newDescription: DescriptionValueObject
  ) {}
}
