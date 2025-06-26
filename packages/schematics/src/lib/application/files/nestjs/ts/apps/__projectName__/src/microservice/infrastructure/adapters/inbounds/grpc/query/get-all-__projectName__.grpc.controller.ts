/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

/**
 * GetAll__ProjectName__sGrpcController
 * -----------------------------------------------------------------------------
 * Este controlador maneja la llamada gRPC `getAll__ProjectName__s` definida en el servicio `__ProjectName__Service`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `GetAll__ProjectName__sQuery` usando el `QueryBus` de NestJS
 * ✅ Transformar el resultado (entidades de dominio) en formato Protobuf (DTO)
 * ✅ Devolverlo como respuesta al cliente gRPC
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

import { __projectNameCamel__ } from '@proto'

import { GetAll__ProjectName__sQuery } from '@__projectName__/microservice/application/ports/inbounds/queries'
import { __ProjectName__Entity } from '@__projectName__/microservice/domain/entities/__projectName__.entity'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Controller()
export class GetAll__ProjectName__sGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  /**
   * Implementación de la operación `getAll__ProjectName__s()` definida en el archivo .proto
   *
   * Flujo:
   *  1. Se ejecuta la query `GetAll__ProjectName__sQuery` a través del `QueryBus`
   *  2. El `QueryHandler` correspondiente devuelve una lista de `__ProjectName__Entity`
   *  3. Se mapean a objetos ` __projectNameCamel__.__ProjectName__` (Protobuf)
   *  4. Se devuelve el objeto ` __projectNameCamel__.__ProjectName__s` (con una lista de resultados)
   *
   * @returns Protobuf ` __projectNameCamel__.__ProjectName__s` con la lista de ejemplos
   */
  @GrpcMethod(
    __projectNameCamel__.__ProjectName___SERVICE_NAME,
    'getAll__ProjectName__s'
  )
  async getAll__ProjectName__s(): Promise<__projectNameCamel__.__ProjectName__s> {
    const entities = await this.queryBus.execute<
      GetAll__ProjectName__sQuery,
      __ProjectName__Entity[]
    >(new GetAll__ProjectName__sQuery())

    return {
      __projectNameCamel__s: entities.map((entity) =>
        this.mapper.entityToProto(entity)
      )
    }
  }
}
