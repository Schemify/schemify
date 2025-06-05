import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { KafkaProducerService } from './client/kafka-producer.service'

import { Kafka__ProjectName__EventsPublisher } from '../kafka/producers/kafka-__projectName__-events.publisher'
import { __ProjectName__EventPublisherPort } from '@__projectName__/microservice/application/ports/outbounds/messaging/__projectName__-event-publisher.port'
import { buildKafkaProducerOptions } from '@__projectName__/libs/shared/config/kafka/kafka.config'

@Module({
  imports: [
    ClientsModule.register([
      buildKafkaProducerOptions({
        clientId: 'schemify-producer',
        brokers: ['kafka1:9092']
      })
    ])
  ],
  providers: [
    KafkaProducerService,
    {
      provide: __ProjectName__EventPublisherPort,
      useClass: Kafka__ProjectName__EventsPublisher
    }
  ],
  exports: [KafkaProducerService, __ProjectName__EventPublisherPort]
})
export class KafkaProducerModule {}
