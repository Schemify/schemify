import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { __project_name_camel__Module } from './microservice/__project_name_kebab__.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    __project_name_camel__Module
  ]
})
export class AppModule {}
