/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../client/kafka-producer.service'

import { __project_name_camel__CreatedPublisherPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/messaging/__project_name_kebab__-created-publisher.port'

import { __project_name_pascal__CreatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-created.event'

import { Envelope } from 'apps/__project_name_kebab__/src/libs/shared/events/event-envelope'

import { __project_name_snake___events } from '@proto'

@Injectable()
export class Kafka__project_name_camel__CreatedPublisher
  implements __project_name_camel__CreatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(event: __project_name_pascal__CreatedEvent): Promise<void> {
    // 🔁 Map domain event to proto
    const protoEvent: __project_name_snake___events.__project_name_pascal__CreatedEvent =
      {
        id: event.__project_name_camel__.id,
        name: event.__project_name_camel__.props.name.value,
        description:
          event.__project_name_camel__.props.description?.value ?? undefined,
        createdAt: event.__project_name_camel__.props.createdAt.toISOString(),
        updatedAt:
          event.__project_name_camel__.props.updatedAt?.toISOString() ??
          undefined
      }

    const message: Envelope<__project_name_snake___events.__project_name_pascal__CreatedEvent> =
      {
        type: '__project_name_camel__Created',
        version: 1,
        payload: protoEvent
      }

    await this.kafkaProducer.emit('__project_name_camel__.created', {
      key: protoEvent.id,
      value: JSON.stringify(message)
    })
  }
}
