/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Get__ProjectName__ByIdGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC para manejar la operación `get__ProjectName__ById()` del servicio `__ProjectName__Service`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `Get__ProjectName__ByIdQuery` usando el `QueryBus`
 * ✅ Convertir la entidad `__ProjectName__Entity` en una respuesta Protobuf (__projectName__.__ProjectName__)
 * ✅ Devolver la respuesta al cliente gRPC
 *
 * 🔒 No accede directamente a la base de datos.
 * 🔁 No contiene lógica de negocio (sólo delega y transforma).
 */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __projectNameCamel__ } from '@proto'

import { Get__ProjectName__ByIdQuery } from '@__projectName__/microservice/application/ports/inbounds/queries'
import { __ProjectName__Mapper } from '@__projectName__/microservice/infrastructure/mappers/__projectName__.mapper'

@Controller('__ProjectName__Service')
export class Get__ProjectName__ByIdGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __ProjectName__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__ProjectName__ServiceController`
   * ya que sólo expone un RPC (`get__ProjectName__ById`).
   * NestJS vincula este método gracias al decorador
   * `@__ProjectName__ServiceControllerMethods()` usando reflexión.
   *
   * 👉 No usar `implements __ProjectName__ServiceController` para evitar errores TS2420
   */

  /**
   * Maneja la llamada RPC `get__ProjectName__ById`.
   *
   * Flujo:
   *  1. Recibe un DTO con el `id` del ejemplo a buscar
   *  2. Ejecuta el caso de uso `Get__ProjectName__ByIdQuery` a través del `QueryBus`
   *  3. El handler devuelve una entidad del dominio `__ProjectName__Entity`
   *  4. Se transforma en un objeto Protobuf (`__projectNameCamel__.__ProjectName__`)
   *  5. Se retorna al cliente gRPC
   *
   * @param request DTO generado desde el contrato gRPC (`.proto`)
   * @returns __projectNameCamel__.__ProjectName__ (objeto compatible con el contrato Protobuf)
   */

  @GrpcMethod(
    __projectNameCamel__.__ProjectName___SERVICE_NAME,
    'get__ProjectName__ById'
  )
  async get__ProjectName__ById(
    request: __projectNameCamel__.Get__ProjectName__ByIdDto
  ): Promise<__projectNameCamel__.__ProjectName__> {
    const query = new Get__ProjectName__ByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}
