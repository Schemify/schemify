import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CommandHandlers } from './ports/inbounds/commands'
import { QueryHandlers } from './ports/inbounds/queries'
import { EventHandlers } from './ports/inbounds/events'
import { UseCasesModule } from './use-cases/use-cases.module'

import { SharedModule } from '@micromicro/libs/shared/shared.module'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

import { OutboundsModule } from '@micromicro/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [CqrsModule, SharedModule, OutboundsModule, UseCasesModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    MicromicroMapper
  ],
  exports: [CqrsModule]
})
export class ApplicationModule {}
