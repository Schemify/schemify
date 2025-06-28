import { IEvent } from '@nestjs/cqrs'
import { __project_name_pascal__Entity } from '../entities/__project_name_camel__.entity'

export class __project_name_pascal__CreatedEvent implements IEvent {
  public readonly __project_name_camel__: __project_name_pascal__Entity

  constructor(__project_name_camel__: __project_name_pascal__Entity) {
    this.__project_name_camel__ = __project_name_camel__
  }
}
