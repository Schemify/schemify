import { Module } from '@nestjs/common'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Module({
  providers: [__project_name_pascal__Mapper],
  exports: [__project_name_pascal__Mapper]
})
export class SharedModule {}
