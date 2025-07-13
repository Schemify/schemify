/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../client/kafka-producer.service'

import { MicroserviceNameCreatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microserviceName-created-publisher.port'

import { MicroserviceNameCreatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-created.event'

import { Envelope } from '@microserviceName/libs/shared/events/event-envelope'

@Injectable()
export class KafkaMicroserviceNameCreatedPublisher
  implements MicroserviceNameCreatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(event: MicroserviceNameCreatedEvent): Promise<void> {
    const message: Envelope<MicroserviceNameCreatedEvent> = {
      type: 'MicroserviceNameCreated',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit('microserviceName.created', {
      key: event.microserviceName.id,
      value: JSON.stringify(message)
    })
  }
}
