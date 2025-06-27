import { Module } from '@nestjs/common'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Module({
  providers: [MicromicroMapper],
  exports: [MicromicroMapper]
})
export class SharedModule {}
