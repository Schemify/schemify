import { Module } from '@nestjs/common'
import { OutboundsModule } from '@microserviceName/microservice/infrastructure/adapters/outbounds/outbounds.module'

import { PrintConsoleUseCase } from './print-console/print-console.use-case'

@Module({
  imports: [OutboundsModule],
  providers: [PrintConsoleUseCase],
  exports: [PrintConsoleUseCase]
})
export class UseCasesModule {}
