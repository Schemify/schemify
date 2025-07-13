import { Module } from '@nestjs/common'
import { OutboundsModule } from 'apps/__project_name_kebab__/src/microservice/infrastructure/adapters/outbounds/outbounds.module'

import { PrintConsoleUseCase } from './print-console/print-console.use-case'

@Module({
  imports: [OutboundsModule],
  providers: [PrintConsoleUseCase],
  exports: [PrintConsoleUseCase]
})
export class UseCasesModule {}
