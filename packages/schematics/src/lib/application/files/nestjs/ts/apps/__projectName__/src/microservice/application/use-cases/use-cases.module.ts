import { Module } from '@nestjs/common'
import { Print__ProjectName__InfoUseCase } from './messaging/kafka/print-__projectName__-info.use-case'
import { OutboundsModule } from '@__projectName__/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [OutboundsModule],
  providers: [Print__ProjectName__InfoUseCase],
  exports: [Print__ProjectName__InfoUseCase]
})
export class UseCasesModule {}
