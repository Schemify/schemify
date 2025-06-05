import { Module } from '@nestjs/common'
import { KafkaOptions } from '@nestjs/microservices'

import { KafkaConsumers } from './consumers'

import { ApplicationModule } from '@__projectName__/microservice/application/application.module'
import { buildKafkaConsumerOptions } from '@__projectName__/libs/shared/config/kafka/kafka.config'

@Module({
  imports: [ApplicationModule],
  controllers: [...KafkaConsumers]
})
export class KafkaConsumerModule {
  static transport(): KafkaOptions {
    return buildKafkaConsumerOptions({
      clientId: 'schemify-consumer',
      groupId: '__projectName__-group',
      brokers: ['kafka1:9092']
    })
  }
}
