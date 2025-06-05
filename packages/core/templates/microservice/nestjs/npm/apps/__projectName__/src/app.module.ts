import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { __ProjectName__Module } from './microservice/__projectName__.module'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    __ProjectName__Module]
})
export class AppModule {}
