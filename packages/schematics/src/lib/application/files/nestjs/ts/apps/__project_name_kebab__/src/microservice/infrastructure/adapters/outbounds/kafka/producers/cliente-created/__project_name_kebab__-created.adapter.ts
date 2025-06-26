/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../__project_name_camel__/kafka-producer.service'

import { __project_name_pascal__CreatedPublisherPort } from '@__project_name_camel__/microservice/application/ports/outbounds/messaging/__project_name_camel__-created-publisher.port'

import { __project_name_pascal__CreatedEvent } from '@__project_name_camel__/microservice/domain/events/__project_name_camel__-created.event'

import { Envelope } from '@__project_name_camel__/libs/shared/events/event-envelope'

@Injectable()
export class Kafka__project_name_pascal__CreatedPublisher
  implements __project_name_pascal__CreatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(event: __project_name_pascal__CreatedEvent): Promise<void> {
    const message: Envelope<__project_name_pascal__CreatedEvent> = {
      type: '__project_name_pascal__Created',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit('__project_name_camel__.created', {
      key: event.__project_name_camel__.id,
      value: JSON.stringify(message)
    })
  }
}
