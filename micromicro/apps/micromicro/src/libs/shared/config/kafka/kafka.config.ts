/* eslint-disable @typescript-eslint/no-empty-object-type */

import { KafkaOptions, Transport } from '@nestjs/microservices'
import { KafkaConfig, logLevel } from 'kafkajs'

export interface KafkaCommonConfig {
  micromicroId: string
  brokers: string[]
  retries?: number
  connectionTimeout?: number
  requestTimeout?: number
}

export interface KafkaProducerConfig extends KafkaCommonConfig {}

export interface KafkaConsumerConfig extends KafkaCommonConfig {
  groupId: string
}

export const defaultKafkaRetryConfig = {
  maxRetryTime: 60000,
  initialRetryTime: 1000,
  retries: 10
}

export const createKafkaMicromicroConfig = ({
  micromicroId,
  brokers,
  retries = 10,
  connectionTimeout = 5000,
  requestTimeout = 3000
}: KafkaCommonConfig): KafkaConfig => ({
  micromicroId,
  brokers,
  connectionTimeout,
  requestTimeout,
  retry: {
    ...defaultKafkaRetryConfig,
    retries
  },
  logLevel: logLevel.ERROR
})

export const buildKafkaProducerOptions = (
  config: KafkaProducerConfig
): KafkaOptions & { name: string } => ({
  name: 'KAFKA_PRODUCER',
  transport: Transport.KAFKA,
  options: {
    micromicro: createKafkaMicromicroConfig(config),
    producer: {
      allowAutoTopicCreation: true,
      idempotent: true
    }
  }
})

export const buildKafkaConsumerOptions = (
  config: KafkaConsumerConfig
): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    micromicro: createKafkaMicromicroConfig(config),
    consumer: {
      groupId: config.groupId,
      allowAutoTopicCreation: true,
      retry: {
        initialRetryTime: 1000,
        retries: 10
      }
    },
    subscribe: {
      fromBeginning: true
    },
    run: {
      autoCommit: true,
      partitionsConsumedConcurrently: 3
    }
  }
})
