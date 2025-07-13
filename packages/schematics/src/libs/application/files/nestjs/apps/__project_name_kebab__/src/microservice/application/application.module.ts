import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CommandHandlers } from './ports/inbounds/commands'
import { QueryHandlers } from './ports/inbounds/queries'
import { EventHandlers } from './ports/inbounds/events'
import { UseCasesModule } from './use-cases/use-cases.module'

import { SharedModule } from 'apps/__project_name_kebab__/src/libs/shared/shared.module'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

import { OutboundsModule } from 'apps/__project_name_kebab__/src/microservice/infrastructure/adapters/outbounds/outbounds.module'

@Module({
  imports: [CqrsModule, SharedModule, OutboundsModule, UseCasesModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    __project_name_pascal__Mapper
  ],
  exports: [CqrsModule, UseCasesModule]
})
export class ApplicationModule {}
