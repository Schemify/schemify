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
  Create__project_name_pascal__Port,
  Update__project_name_pascal__Port,
  Delete__project_name_pascal__Port
} from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-command-ports'

import {
  GetAll__project_name_pascal__Port,
  Get__project_name_pascal__ByIdPort,
  Get__project_name_pascal__WithCursorPort
} from 'apps/__project_name_kebab__/src/microservice/application/ports/outbounds/repositories/__project_name_kebab__-query-ports'

// Adaptadores de salida (implementaciones)
import {
  Create__project_name_pascal__PrismaRepository,
  Update__project_name_pascal__PrismaRepository,
  Delete__project_name_pascal__PrismaRepository
} from './command'

import {
  GetAll__project_name_pascal__PrismaRepository,
  Get__project_name_pascal__ByIdPrismaRepository,
  Get__project_name_pascal__WithCursorPrismaRepository
} from './query'

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [
    __project_name_pascal__Mapper,
    PrismaService,

    // Command ports
    {
      provide: Create__project_name_pascal__Port,
      useClass: Create__project_name_pascal__PrismaRepository
    },
    {
      provide: Update__project_name_pascal__Port,
      useClass: Update__project_name_pascal__PrismaRepository
    },
    {
      provide: Delete__project_name_pascal__Port,
      useClass: Delete__project_name_pascal__PrismaRepository
    },

    // Query ports
    {
      provide: Get__project_name_pascal__ByIdPort,
      useClass: Get__project_name_pascal__ByIdPrismaRepository
    },
    {
      provide: GetAll__project_name_pascal__Port,
      useClass: GetAll__project_name_pascal__PrismaRepository
    },
    {
      provide: Get__project_name_pascal__WithCursorPort,
      useClass: Get__project_name_pascal__WithCursorPrismaRepository
    }
  ],
  exports: [
    Create__project_name_pascal__Port,
    Update__project_name_pascal__Port,
    Delete__project_name_pascal__Port,
    Get__project_name_pascal__ByIdPort,
    GetAll__project_name_pascal__Port,
    Get__project_name_pascal__WithCursorPort,
    PrismaService
  ]
})
export class PrismaModule {}
