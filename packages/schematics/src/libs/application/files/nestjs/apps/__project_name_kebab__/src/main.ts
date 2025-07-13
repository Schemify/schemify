import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

import { GrpcServerModule } from './microservice/infrastructure/adapters/inbounds/grpc/grpc-server.module'
import { KafkaConsumerModule } from './microservice/infrastructure/adapters/inbounds/kafka/kafka-consumer.module'

// import { EventBus } from '@nestjs/cqrs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()

  const logger = new Logger('SchemifyMicroservice')

  // Configurar microservicio gRPC
  app.connectMicroservice(GrpcServerModule.transport())

  // Configurar microservicio Kafka
  app.connectMicroservice(KafkaConsumerModule.transport())

  await app.startAllMicroservices()
  logger.log(
    `✅ Microservicio gRPC listo en puerto  ${process.env.SERVICE_GRPC_URL}`
  )
  logger.log('✅ Microservicio Kafka configurado')

  await app.init()
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap')
  logger.error('💥 Error al iniciar el microservicio', err)
  process.exit(1)
})
