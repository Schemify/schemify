/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../micromicro/kafka-producer.service'

import { MicromicroDescriptionUpdatedPublisherPort } from '@micromicro/microservice/application/ports/outbounds/messaging/micromicro-description-updated-publisher.port'

import { MicromicroDescriptionUpdatedEvent } from '@micromicro/microservice/domain/events/micromicro-description-updated.event'

import { Envelope } from '@micromicro/libs/shared/events/event-envelope'

@Injectable()
export class KafkaMicromicroDescriptionUpdatedPublisher
  implements MicromicroDescriptionUpdatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(
    event: MicromicroDescriptionUpdatedEvent
  ): Promise<void> {
    const message: Envelope<MicromicroDescriptionUpdatedEvent> = {
      type: 'MicromicroDescriptionUpdated',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit(
      'micromicro.description-updated',
      {
        key: event.id,
        value: JSON.stringify(message)
      }
    )
  }
}
