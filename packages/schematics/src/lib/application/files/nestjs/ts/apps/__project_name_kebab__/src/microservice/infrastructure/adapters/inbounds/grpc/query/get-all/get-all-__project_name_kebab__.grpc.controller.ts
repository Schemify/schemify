/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

/**
 * GetAll__project_name_pascal__GrpcController
 * -----------------------------------------------------------------------------
 * Este controlador maneja la llamada gRPC `getAll__project_name_pascal__` definida en el servicio `__project_name_pascal__Service`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `GetAll__project_name_pascal__Query` usando el `QueryBus` de NestJS
 * ✅ Transformar el resultado (entidades de dominio) en formato Protobuf (DTO)
 * ✅ Devolverlo como respuesta al __project_name_camel__ gRPC
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

import { __project_name_camel__ } from '@proto'

import { GetAll__project_name_pascal__Query } from '@__project_name_camel__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Entity } from '@__project_name_camel__/microservice/domain/entities/__project_name_camel__.entity'
import { __project_name_pascal__Mapper } from '@__project_name_camel__/microservice/infrastructure/mappers/__project_name_camel__.mapper'

@Controller()
export class GetAll__project_name_pascal__GrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  /**
   * Implementación de la operación `getAll__project_name_pascal__()` definida en el archivo .proto
   *
   * Flujo:
   *  1. Se ejecuta la query `GetAll__project_name_pascal__Query` a través del `QueryBus`
   *  2. El `QueryHandler` correspondiente devuelve una lista de `__project_name_pascal__Entity`
   *  3. Se mapean a objetos ` __project_name_camel__.__project_name_pascal__` (Protobuf)
   *  4. Se devuelve el objeto ` __project_name_camel__.__project_name_pascal__` (con una lista de resultados)
   *
   * @returns Protobuf ` __project_name_camel__.__project_name_pascal__` con la lista de ejemplos
   */
  @GrpcMethod('__project_name_pascal__Service', 'getAll__project_name_pascal__')
  async getAll__project_name_pascal__(): Promise<__project_name_pascal__List> {
    const entities = await this.queryBus.execute(
      new GetAll__project_name_pascal__Query()
    )

    return {
      __project_name_camel__: entities.map((entity) =>
        this.mapper.entityToProto(entity)
      )
    }
  }
}
