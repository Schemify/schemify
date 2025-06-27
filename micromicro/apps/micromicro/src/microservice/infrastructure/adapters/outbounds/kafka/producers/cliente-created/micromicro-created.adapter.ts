/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../../micromicro/kafka-producer.service'

import { MicromicroCreatedPublisherPort } from '@micromicro/microservice/application/ports/outbounds/messaging/micromicro-created-publisher.port'

import { MicromicroCreatedEvent } from '@micromicro/microservice/domain/events/micromicro-created.event'

import { Envelope } from '@micromicro/libs/shared/events/event-envelope'

@Injectable()
export class KafkaMicromicroCreatedPublisher
  implements MicromicroCreatedPublisherPort
{
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publish(event: MicromicroCreatedEvent): Promise<void> {
    const message: Envelope<MicromicroCreatedEvent> = {
      type: 'MicromicroCreated',
      version: 1,
      payload: event
    }

    await this.kafkaProducer.emit('micromicro.created', {
      key: event.micromicro.id,
      value: JSON.stringify(message)
    })
  }
}
