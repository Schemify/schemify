import { Module } from '@nestjs/common'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'

@Module({
  providers: [MicroserviceNameMapper],
  exports: [MicroserviceNameMapper]
})
export class SharedModule {}
