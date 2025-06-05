/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
import { Injectable } from '@nestjs/common'

import { KafkaProducerService } from '../client/kafka-producer.service'

import { __ProjectName__EventPublisherPort } from '@__projectName__/microservice/application/ports/outbounds/messaging/__projectName__-event-publisher.port'

import { __ProjectName__CreatedEvent } from '@__projectName__/microservice/domain/events/__projectName__-created.event'

import { Envelope } from '@__projectName__/libs/shared/events/event-envelope'

@Injectable()
export class Kafka__ProjectName__EventsPublisher implements __ProjectName__EventPublisherPort {
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async publishCreatedEvent(evt: __ProjectName__CreatedEvent) {
    const message: Envelope<__ProjectName__CreatedEvent> = {
      type: '__ProjectName__Created',
      version: 1,
      payload: evt
    }
    await this.kafkaProducer.emit('__projectName__.created', {
      key: evt.__projectNameCamel__.id,
      value: JSON.stringify(message)
    })
  }
}
