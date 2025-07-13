/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../client/kafka-producer.service'

import { MicroserviceNameCreatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microservice-name-created-publisher.port'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microservice-name-created.event'

import { Envelope } from '@microserviceName/libs/shared/events/event-envelope'

import { microservice_name_events } from '@proto'

@Injectable()
export class KafkaMicroserviceNameCreatedPublisher
  implements MicroserviceNameCreatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(event: MicroserviceNameCreatedEvent): Promise<void> {
    // 🔁 Map domain event to proto
    const protoEvent: microservice_name_events.MicroserviceNameCreatedEvent =
      {
        id: event.microserviceName.id,
        name: event.microserviceName.props.name.value,
        description:
          event.microserviceName.props.description?.value ?? undefined,
        createdAt: event.microserviceName.props.createdAt.toISOString(),
        updatedAt:
          event.microserviceName.props.updatedAt?.toISOString() ??
          undefined
      }

    const message: Envelope<microservice_name_events.MicroserviceNameCreatedEvent> =
      {
        type: 'MicroserviceNameCreated',
        version: 1,
        payload: protoEvent
      }

    await this.kafkaProducer.emit('microserviceName.created', {
      key: protoEvent.id,
      value: JSON.stringify(message)
    })
  }
}
