import { Module } from '@nestjs/common'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Module({
  providers: [__project_name_pascal__Mapper],
  exports: [__project_name_pascal__Mapper]
})
export class SharedModule {}
