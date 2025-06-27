import { Module } from '@nestjs/common'
import { PrintMicromicroInfoUseCase } from './messaging/kafka/print-micromicro-info.use-case'
import { OutboundsModule } from '@micromicro/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [OutboundsModule],
  providers: [PrintMicromicroInfoUseCase],
  exports: [PrintMicromicroInfoUseCase]
})
export class UseCasesModule {}
