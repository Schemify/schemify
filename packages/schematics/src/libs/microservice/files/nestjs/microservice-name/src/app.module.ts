import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MicroserviceNameModule } from './microservice/microserviceName.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MicroserviceNameModule
  ]
})
export class AppModule {}
