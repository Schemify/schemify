/**
 * __project_name_pascal__Module
 * -----------------------------------------------------------------------------
 * Módulo raíz del microservicio `__project_name_pascal__`.
 *
 * ✅ Importa la infraestructura (repositorios, Kafka, etc.)
 * ✅ Importa la capa de aplicación (CQRS handlers y mappers)
 * ✅ Realiza el binding de puertos a adaptadores (useClass)
 * ✅ Registra los controladores gRPC
 * ✅ Expone el servicio del microservicio en NestJS
 */

import { Module } from '@nestjs/common'

import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { ApplicationModule } from './application/application.module'

import { SharedModule } from '@__project_name_kebab__/libs/shared/shared.module'

@Module({
  imports: [InfrastructureModule, ApplicationModule, SharedModule],

  exports: [InfrastructureModule, ApplicationModule, SharedModule]
})
export class __project_name_pascal__Module {}
