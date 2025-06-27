import { IEvent } from '@nestjs/cqrs'
import { MicromicroEntity } from '../entities/micromicro.entity'

export class MicromicroCreatedEvent implements IEvent {
  public readonly micromicro: MicromicroEntity

  constructor(micromicro: MicromicroEntity) {
    this.micromicro = micromicro
  }
}
