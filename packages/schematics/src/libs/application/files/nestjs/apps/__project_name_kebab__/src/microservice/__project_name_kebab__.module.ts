import { Module } from '@nestjs/common'

import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ApplicationModule } from './application/application.module'

import { SharedModule } from 'apps/__project_name_kebab__/src/libs/shared/shared.module'

@Module({
  imports: [InfrastructureModule, ApplicationModule, SharedModule],

  exports: [InfrastructureModule, ApplicationModule, SharedModule]
})
export class __project_name_pascal__Module {}
