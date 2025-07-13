/**
 * PrismaModule
 * -----------------------------------------------------------------------------
 * Módulo responsable de registrar el servicio Prisma__project_name_camel__ como un provider.
 * Este módulo se importa una sola vez y se exporta para cualquier otro
 * módulo que necesite acceso a la base de datos.
 */

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'

import { SharedModule } from 'apps/__project_name_kebab__/src/libs/shared/shared.module'
import { __project_name_pascal__Mapper } from 'apps/__project_name_kebab__/src/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

// Puertos (abstract classes)
import {
  Create__project_name_camel__Port,
  Update__project_name_camel__Port,
  Delete__project_name_camel__Port
} from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'

import {
  GetAll__project_name_camel__Port,
  Get__project_name_camel__ByIdPort,
  Get__project_name_camel__WithCursorPort
} from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

// Adaptadores de salida (implementaciones)
import {
  Create__project_name_camel__PrismaRepository,
  Update__project_name_camel__PrismaRepository,
  Delete__project_name_camel__PrismaRepository
} from './command'

import {
  GetAll__project_name_camel__PrismaRepository,
  Get__project_name_camel__ByIdPrismaRepository,
  Get__project_name_camel__WithCursorPrismaRepository
} from './query'

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [
    __project_name_pascal__Mapper,
    PrismaService,

    // Command ports
    {
      provide: Create__project_name_camel__Port,
      useClass: Create__project_name_camel__PrismaRepository
    },
    {
      provide: Update__project_name_camel__Port,
      useClass: Update__project_name_camel__PrismaRepository
    },
    {
      provide: Delete__project_name_camel__Port,
      useClass: Delete__project_name_camel__PrismaRepository
    },

    // Query ports
    {
      provide: Get__project_name_camel__ByIdPort,
      useClass: Get__project_name_camel__ByIdPrismaRepository
    },
    {
      provide: GetAll__project_name_camel__Port,
      useClass: GetAll__project_name_camel__PrismaRepository
    },
    {
      provide: Get__project_name_camel__WithCursorPort,
      useClass: Get__project_name_camel__WithCursorPrismaRepository
    }
  ],
  exports: [
    Create__project_name_camel__Port,
    Update__project_name_camel__Port,
    Delete__project_name_camel__Port,
    Get__project_name_camel__ByIdPort,
    GetAll__project_name_camel__Port,
    Get__project_name_camel__WithCursorPort,
    PrismaService
  ]
})
export class PrismaModule {}
