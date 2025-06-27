/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

/**
 * GetAllMicromicroGrpcController
 * -----------------------------------------------------------------------------
 * Este controlador maneja la llamada gRPC `getAllMicromicro` definida en el servicio `MicromicroService`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `GetAllMicromicroQuery` usando el `QueryBus` de NestJS
 * ✅ Transformar el resultado (entidades de dominio) en formato Protobuf (DTO)
 * ✅ Devolverlo como respuesta al micromicro gRPC
 *
 * Forma parte de la capa de **infraestructura**, implementando el endpoint del contrato gRPC,
 * pero delegando toda la lógica de negocio a la capa de aplicación.
 *
 * NOTA:
 * - Este controlador NO contiene lógica de negocio
 * - NO accede a la base de datos directamente
 * - Solo orquesta: recibe, delega, transforma y responde
 */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { micromicro } from '@proto'

import { GetAllMicromicroQuery } from '@micromicro/microservice/application/ports/inbounds/queries'
import { MicromicroEntity } from '@micromicro/microservice/domain/entities/micromicro.entity'
import { MicromicroMapper } from '@micromicro/microservice/infrastructure/mappers/micromicro.mapper'

@Controller()
export class GetAllMicromicroGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: MicromicroMapper
  ) {}

  /**
   * Implementación de la operación `getAllMicromicro()` definida en el archivo .proto
   *
   * Flujo:
   *  1. Se ejecuta la query `GetAllMicromicroQuery` a través del `QueryBus`
   *  2. El `QueryHandler` correspondiente devuelve una lista de `MicromicroEntity`
   *  3. Se mapean a objetos ` micromicro.Micromicro` (Protobuf)
   *  4. Se devuelve el objeto ` micromicro.Micromicro` (con una lista de resultados)
   *
   * @returns Protobuf ` micromicro.Micromicro` con la lista de ejemplos
   */
  @GrpcMethod('MicromicroService', 'getAllMicromicro')
  async getAllMicromicro(): Promise<MicromicroList> {
    const entities = await this.queryBus.execute(
      new GetAllMicromicroQuery()
    )

    return {
      micromicro: entities.map((entity) =>
        this.mapper.entityToProto(entity)
      )
    }
  }
}
