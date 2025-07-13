import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CommandHandlers } from './ports/inbounds/commands'
import { QueryHandlers } from './ports/inbounds/queries'
import { EventHandlers } from './ports/inbounds/events'
import { UseCasesModule } from './use-cases/use-cases.module'

import { SharedModule } from '@microserviceName/libs/shared/shared.module'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microservice-name.mapper'

import { OutboundsModule } from '@microserviceName/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [CqrsModule, SharedModule, OutboundsModule, UseCasesModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    MicroserviceNameMapper
  ],
  exports: [CqrsModule, UseCasesModule]
})
export class ApplicationModule {}
