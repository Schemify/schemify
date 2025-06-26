/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../client/kafka-producer.service'

import { __project_name_pascal__DescriptionUpdatedPublisherPort } from '@__project_name_kebab__/microservice/application/ports/outbounds/messaging/__project_name_kebab__-description-updated-publisher.port'

import { __project_name_pascal__DescriptionUpdatedEvent } from '@__project_name_kebab__/microservice/domain/events/__project_name_kebab__-description-updated.event'

import { Envelope } from '@__project_name_kebab__/libs/shared/events/event-envelope'

@Injectable()
export class Kafka__project_name_pascal__DescriptionUpdatedPublisher
  implements __project_name_pascal__DescriptionUpdatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(event: __project_name_pascal__DescriptionUpdatedEvent): Promise<void> {
    const message: Envelope<__project_name_pascal__DescriptionUpdatedEvent> = {
      type: '__project_name_pascal__DescriptionUpdated',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit('__project_name_kebab__.description-updated', {
      key: event.id,
      value: JSON.stringify(message)
    })
  }
}
