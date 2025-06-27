import { Module, Logger } from '@nestjs/common'
import { MicromicrosModule } from '@nestjs/microservices'

import { KafkaProducerService } from './micromicro/kafka-producer.service'

import { KafkaMicromicroCreatedPublisher } from './producers/micromicro-created/micromicro-created.adapter'
import { MicromicroCreatedPublisherPort } from '@micromicro/microservice/application/ports/outbounds/messaging/micromicro-created-publisher.port'
import { buildKafkaProducerOptions } from '@micromicro/libs/shared/config/kafka/kafka.config'

const kafkaConfig = {
  micromicroId: process.env.KAFKA_CLIENT_ID || 'schemify-producer',
  brokers: (process.env.KAFKA_BROKERS || 'kafka1:9092')
    .split(',')
    .map((broker) => broker.trim())
    .filter((broker) => broker.length > 0)
}

// Log de configuración usando NestJS Logger
const logger = new Logger('KafkaProducerModule')
logger.log('🔧 Kafka Producer Config:', {
  micromicroId: kafkaConfig.micromicroId,
  brokers: kafkaConfig.brokers,
  env: {
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKERS: process.env.KAFKA_BROKERS
  }
})

@Module({
  imports: [
    MicromicrosModule.register([
      buildKafkaProducerOptions(kafkaConfig)
    ])
  ],
  providers: [
    KafkaProducerService,
    {
      provide: MicromicroCreatedPublisherPort,
      useClass: KafkaMicromicroCreatedPublisher
    }
  ],
  exports: [KafkaProducerService, MicromicroCreatedPublisherPort]
})
export class KafkaProducerModule {}
