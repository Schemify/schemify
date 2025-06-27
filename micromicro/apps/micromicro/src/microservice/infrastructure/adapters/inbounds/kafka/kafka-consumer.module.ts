import { Module, Logger } from '@nestjs/common'
import { KafkaOptions } from '@nestjs/microservices'

import { KafkaConsumers } from './consumers'

import { ApplicationModule } from '@micromicro/microservice/application/application.module'
import { buildKafkaConsumerOptions } from '@micromicro/libs/shared/config/kafka/kafka.config'

// Configuración de Kafka con validación
const kafkaConfig = {
  micromicroId: process.env.KAFKA_CLIENT_ID || 'schemify-consumer',
  groupId: process.env.KAFKA_GROUP_ID || 'micromicro-group',
  brokers: (process.env.KAFKA_BROKERS || 'kafka1:9092')
    .split(',')
    .map((broker) => broker.trim())
    .filter((broker) => broker.length > 0) // Filtrar brokers vacíos
}

// Log de configuración usando NestJS Logger
const logger = new Logger('KafkaConsumerModule')
logger.log('🔧 Kafka Consumer Config:', {
  micromicroId: kafkaConfig.micromicroId,
  groupId: kafkaConfig.groupId,
  brokers: kafkaConfig.brokers,
  env: {
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID,
    KAFKA_BROKERS: process.env.KAFKA_BROKERS
  }
})

@Module({
  imports: [ApplicationModule],
  controllers: [...KafkaConsumers]
})
export class KafkaConsumerModule {
  static transport(): KafkaOptions {
    return buildKafkaConsumerOptions(kafkaConfig)
  }
}
