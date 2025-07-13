import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { __project_name_pascal__Module } from './microservice/__project_name_kebab__.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    __project_name_pascal__Module
  ]
})
export class AppModule {}
