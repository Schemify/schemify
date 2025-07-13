/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../client/kafka-producer.service'

import { MicroserviceNameDescriptionUpdatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microserviceName-description-updated-publisher.port'

import { MicroserviceNameDescriptionUpdatedEvent } from '@microserviceName/microservice/domain/events/microserviceName-description-updated.event'

import { Envelope } from '@microserviceName/libs/shared/events/event-envelope'

@Injectable()
export class KafkaMicroserviceNameDescriptionUpdatedPublisher
  implements MicroserviceNameDescriptionUpdatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(
    event: MicroserviceNameDescriptionUpdatedEvent
  ): Promise<void> {
    const message: Envelope<MicroserviceNameDescriptionUpdatedEvent> = {
      type: 'MicroserviceNameDescriptionUpdated',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit(
      'microserviceName.description-updated',
      {
        key: event.id,
        value: JSON.stringify(message)
      }
    )
  }
}
