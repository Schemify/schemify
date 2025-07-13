/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../client/kafka-producer.service'

import { __project_name_camel__DescriptionUpdatedPublisherPort } from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/messaging/__project_name_kebab__-description-updated-publisher.port'

import { __project_name_pascal__DescriptionUpdatedEvent } from 'apps/__project_name_kebab__/src/microservice/domain/events/__project_name_kebab__-description-updated.event'

import { Envelope } from 'apps/__project_name_kebab__/src/libs/shared/events/event-envelope'

@Injectable()
export class Kafka__project_name_camel__DescriptionUpdatedPublisher
  implements __project_name_camel__DescriptionUpdatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(
    event: __project_name_pascal__DescriptionUpdatedEvent
  ): Promise<void> {
    const message: Envelope<__project_name_pascal__DescriptionUpdatedEvent> = {
      type: '__project_name_camel__DescriptionUpdated',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit(
      '__project_name_camel__.description-updated',
      {
        key: event.id,
        value: JSON.stringify(message)
      }
    )
  }
}
