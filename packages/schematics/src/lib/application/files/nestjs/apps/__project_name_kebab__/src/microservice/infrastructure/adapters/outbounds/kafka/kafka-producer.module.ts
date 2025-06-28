import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'

import { KafkaProducerService } from './client/kafka-producer.service'

import { Kafka__project_name_pascal__CreatedPublisher } from './producers/__project_name_camel__-created/__project_name_camel__-created.adapter'
import { __project_name_pascal__CreatedPublisherPort } from '@__project_name_camel__/microservice/application/ports/outbounds/messaging/__project_name_camel__-created-publisher.port'
import { buildKafkaProducerOptions } from '@__project_name_camel__/libs/shared/config/kafka/kafka.config'

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
      provide: __project_name_pascal__CreatedPublisherPort,
      useClass: Kafka__project_name_pascal__CreatedPublisher
    }
  ],
  exports: [KafkaProducerService, __project_name_pascal__CreatedPublisherPort]
})
export class KafkaProducerModule {}
