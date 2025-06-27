import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MicromicroModule } from './microservice/micromicro.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MicromicroModule
  ]
})
export class AppModule {}
