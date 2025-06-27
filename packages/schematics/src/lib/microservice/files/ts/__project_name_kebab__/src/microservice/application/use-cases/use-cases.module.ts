import { Module } from '@nestjs/common'
import { Print__project_name_pascal__InfoUseCase } from './messaging/kafka/print-__project_name_camel__-info.use-case'
import { OutboundsModule } from '@__project_name_camel__/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [OutboundsModule],
  providers: [Print__project_name_pascal__InfoUseCase],
  exports: [Print__project_name_pascal__InfoUseCase]
})
export class UseCasesModule {}
