/**
 * PrismaModule
 * -----------------------------------------------------------------------------
 * Módulo responsable de registrar el servicio PrismaMicromicro como un provider.
 * Este módulo se importa una sola vez y se exporta para cualquier otro
 * módulo que necesite acceso a la base de datos.
 */

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'

import { SharedModule } from '@micromicro/libs/shared/shared.module'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

// Puertos (abstract classes)
import {
  CreateMicromicroPort,
  UpdateMicromicroPort,
  DeleteMicromicroPort
} from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-command-ports'

import {
  GetAllMicromicroPort,
  GetMicromicroByIdPort,
  GetMicromicroWithCursorPort
} from '@micromicro/microservice/application/ports/outbounds/repositories/micromicro-query-ports'

// Adaptadores de salida (implementaciones)
import {
  CreateMicromicroPrismaRepository,
  UpdateMicromicroPrismaRepository,
  DeleteMicromicroPrismaRepository
} from './command'

import {
  GetAllMicromicroPrismaRepository,
  GetMicromicroByIdPrismaRepository,
  GetMicromicroWithCursorPrismaRepository
} from './query'

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [
    MicromicroMapper,
    PrismaService,

    // Command ports
    {
      provide: CreateMicromicroPort,
      useClass: CreateMicromicroPrismaRepository
    },
    {
      provide: UpdateMicromicroPort,
      useClass: UpdateMicromicroPrismaRepository
    },
    {
      provide: DeleteMicromicroPort,
      useClass: DeleteMicromicroPrismaRepository
    },

    // Query ports
    {
      provide: GetMicromicroByIdPort,
      useClass: GetMicromicroByIdPrismaRepository
    },
    {
      provide: GetAllMicromicroPort,
      useClass: GetAllMicromicroPrismaRepository
    },
    {
      provide: GetMicromicroWithCursorPort,
      useClass: GetMicromicroWithCursorPrismaRepository
    }
  ],
  exports: [
    CreateMicromicroPort,
    UpdateMicromicroPort,
    DeleteMicromicroPort,
    GetMicromicroByIdPort,
    GetAllMicromicroPort,
    GetMicromicroWithCursorPort,
    PrismaService
  ]
})
export class PrismaModule {}
