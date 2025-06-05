/**
 * PrismaModule
 * -----------------------------------------------------------------------------
 * Módulo responsable de registrar el servicio PrismaClient como un provider.
 * Este módulo se importa una sola vez y se exporta para cualquier otro
 * módulo que necesite acceso a la base de datos.
 */

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma.service'


import { SharedModule } from '@__projectName__/libs/shared/shared.module'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

// Puertos (abstract classes)
import {
  Create__ProjectName__Port,
  Update__ProjectName__Port,
  Delete__ProjectName__Port
} from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-command-ports'

import {
  GetAll__ProjectName__sPort,
  Get__ProjectName__ByIdPort,
  Get__ProjectName__sWithCursorPort
} from '@__projectName__/microservice/application/ports/outbounds/repositories/__projectName__-query-ports'

// Adaptadores de salida (implementaciones)
import {
  Create__ProjectName__PrismaRepository,
  Update__ProjectName__PrismaRepository,
  Delete__ProjectName__PrismaRepository
} from './command'

import {
  GetAll__ProjectName__sPrismaRepository,
  Get__ProjectName__ByIdPrismaRepository,
  Get__ProjectName__sWithCursorPrismaRepository
} from './query'

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [
    __ProjectName__Mapper,
    PrismaService,

    // Command ports
    { provide: Create__ProjectName__Port, useClass: Create__ProjectName__PrismaRepository },
    { provide: Update__ProjectName__Port, useClass: Update__ProjectName__PrismaRepository },
    { provide: Delete__ProjectName__Port, useClass: Delete__ProjectName__PrismaRepository },

    // Query ports
    { provide: Get__ProjectName__ByIdPort, useClass: Get__ProjectName__ByIdPrismaRepository },
    { provide: GetAll__ProjectName__sPort, useClass: GetAll__ProjectName__sPrismaRepository },
    {
      provide: Get__ProjectName__sWithCursorPort,
      useClass: Get__ProjectName__sWithCursorPrismaRepository
    }
  ],
  exports: [
    Create__ProjectName__Port,
    Update__ProjectName__Port,
    Delete__ProjectName__Port,
    Get__ProjectName__ByIdPort,
    GetAll__ProjectName__sPort,
    Get__ProjectName__sWithCursorPort,
    PrismaService
  ]
})
export class PrismaModule {}
