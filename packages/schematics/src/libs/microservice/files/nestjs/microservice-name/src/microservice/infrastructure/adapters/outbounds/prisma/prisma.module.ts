/**
 * PrismaModule
 * -----------------------------------------------------------------------------
 * Módulo responsable de registrar el servicio PrismaMicroserviceName como un provider.
 * Este módulo se importa una sola vez y se exporta para cualquier otro
 * módulo que necesite acceso a la base de datos.
 */

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'

import { SharedModule } from '@microserviceName/libs/shared/shared.module'
import { MicroserviceNameMapper } from '@microserviceName/microservice/infrastructure/mappers/microserviceName.mapper'

// Puertos (abstract classes)
import {
  CreateMicroserviceNamePort,
  UpdateMicroserviceNamePort,
  DeleteMicroserviceNamePort
} from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-command-ports'

import {
  GetAllMicroserviceNamePort,
  GetMicroserviceNameByIdPort,
  GetMicroserviceNameWithCursorPort
} from '@microserviceName/microservice/application/ports/outbounds/repositories/microserviceName-query-ports'

// Adaptadores de salida (implementaciones)
import {
  CreateMicroserviceNamePrismaRepository,
  UpdateMicroserviceNamePrismaRepository,
  DeleteMicroserviceNamePrismaRepository
} from './command'

import {
  GetAllMicroserviceNamePrismaRepository,
  GetMicroserviceNameByIdPrismaRepository,
  GetMicroserviceNameWithCursorPrismaRepository
} from './query'

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [
    MicroserviceNameMapper,
    PrismaService,

    // Command ports
    {
      provide: CreateMicroserviceNamePort,
      useClass: CreateMicroserviceNamePrismaRepository
    },
    {
      provide: UpdateMicroserviceNamePort,
      useClass: UpdateMicroserviceNamePrismaRepository
    },
    {
      provide: DeleteMicroserviceNamePort,
      useClass: DeleteMicroserviceNamePrismaRepository
    },

    // Query ports
    {
      provide: GetMicroserviceNameByIdPort,
      useClass: GetMicroserviceNameByIdPrismaRepository
    },
    {
      provide: GetAllMicroserviceNamePort,
      useClass: GetAllMicroserviceNamePrismaRepository
    },
    {
      provide: GetMicroserviceNameWithCursorPort,
      useClass: GetMicroserviceNameWithCursorPrismaRepository
    }
  ],
  exports: [
    CreateMicroserviceNamePort,
    UpdateMicroserviceNamePort,
    DeleteMicroserviceNamePort,
    GetMicroserviceNameByIdPort,
    GetAllMicroserviceNamePort,
    GetMicroserviceNameWithCursorPort,
    PrismaService
  ]
})
export class PrismaModule {}
