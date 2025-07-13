import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { KafkaProducerService } from './client/kafka-producer.service'

import { KafkaMicroserviceNameCreatedPublisher } from './producers/microservice-name-created/microservice-name-created.adapter'
import { MicroserviceNameCreatedPublisherPort } from '@microserviceName/microservice/application/ports/outbounds/messaging/microservice-name-created-publisher.port'
import { buildKafkaProducerOptions } from '@microserviceName/libs/shared/config/kafka/kafka.config'

const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'schemify-producer',
  brokers: (process.env.KAFKA_BROKERS || 'kafka1:9092')
    .split(',')
    .map((broker) => broker.trim())
    .filter((broker) => broker.length > 0)
}

@Module({
  imports: [ClientsModule.register([buildKafkaProducerOptions(kafkaConfig)])],
  providers: [
    KafkaProducerService,
    {
      provide: MicroserviceNameCreatedPublisherPort,
      useClass: KafkaMicroserviceNameCreatedPublisher
    }
  ],
  exports: [KafkaProducerService, MicroserviceNameCreatedPublisherPort]
})
export class KafkaProducerModule {}
