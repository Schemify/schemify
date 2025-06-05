import { Module } from '@nestjs/common'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Module({
  providers: [__ProjectName__Mapper],
  exports: [__ProjectName__Mapper]
})
export class SharedModule {}
