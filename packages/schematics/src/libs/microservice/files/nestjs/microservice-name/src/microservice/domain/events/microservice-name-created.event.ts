import { IEvent } from '@nestjs/cqrs'
import { MicroserviceNameEntity } from '../entities/microserviceName.entity'

export class MicroserviceNameCreatedEvent implements IEvent {
  public readonly microserviceName: MicroserviceNameEntity

  constructor(microserviceName: MicroserviceNameEntity) {
    this.microserviceName = microserviceName
  }
}
