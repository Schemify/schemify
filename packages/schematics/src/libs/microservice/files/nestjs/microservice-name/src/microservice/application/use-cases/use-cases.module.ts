import { Module } from '@nestjs/common'
import { PrintMicroserviceNameInfoUseCase } from './messaging/kafka/print-microserviceName-info.use-case'
import { OutboundsModule } from '@microserviceName/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [OutboundsModule],
  providers: [PrintMicroserviceNameInfoUseCase],
  exports: [PrintMicroserviceNameInfoUseCase]
})
export class UseCasesModule {}
