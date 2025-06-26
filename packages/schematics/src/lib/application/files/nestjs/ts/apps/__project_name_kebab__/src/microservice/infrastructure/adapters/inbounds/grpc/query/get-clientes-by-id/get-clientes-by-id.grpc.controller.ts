/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */
/**
 * Get__project_name_pascal__ByIdGrpcController
 * -----------------------------------------------------------------------------
 * Controlador gRPC para manejar la operación `get__project_name_pascal__ById()` del servicio `__project_name_pascal__Service`.
 *
 * Se encarga de:
 * ✅ Ejecutar el caso de uso `Get__project_name_pascal__ByIdQuery` usando el `QueryBus`
 * ✅ Convertir la entidad `__project_name_pascal__Entity` en una respuesta Protobuf (__project_name_kebab__.__project_name_pascal__)
 * ✅ Devolver la respuesta al cliente gRPC
 *
 * 🔒 No accede directamente a la base de datos.
 * 🔁 No contiene lógica de negocio (sólo delega y transforma).
 */

import { Controller } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GrpcMethod } from '@nestjs/microservices'

import { __project_name_kebab__ } from '@proto'

import { Get__project_name_pascal__ByIdQuery } from '@__project_name_kebab__/microservice/application/ports/inbounds/queries'
import { __project_name_pascal__Mapper } from '@__project_name_kebab__/microservice/infrastructure/mappers/__project_name_kebab__.mapper'

@Controller('__project_name_pascal__Service')
export class Get__project_name_pascal__ByIdGrpcController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mapper: __project_name_pascal__Mapper
  ) {}

  /**
   * ⚠️ NOTA IMPORTANTE:
   * Esta clase NO implementa la interfaz completa `__project_name_pascal__ServiceController`
   * ya que sólo expone un RPC (`get__project_name_pascal__ById`).
   * NestJS vincula este método gracias al decorador
   * `@__project_name_pascal__ServiceControllerMethods()` usando reflexión.
   *
   * 👉 No usar `implements __project_name_pascal__ServiceController` para evitar errores TS2420
   */

  /**
   * Maneja la llamada RPC `get__project_name_pascal__ById`.
   *
   * Flujo:
   *  1. Recibe un DTO con el `id` del ejemplo a buscar
   *  2. Ejecuta el caso de uso `Get__project_name_pascal__ByIdQuery` a través del `QueryBus`
   *  3. El handler devuelve una entidad del dominio `__project_name_pascal__Entity`
   *  4. Se transforma en un objeto Protobuf (`__project_name_kebab__.__project_name_pascal__`)
   *  5. Se retorna al cliente gRPC
   *
   * @param request DTO generado desde el contrato gRPC (`.proto`)
   * @returns __project_name_kebab__.__project_name_pascal__ (objeto compatible con el contrato Protobuf)
   */

  @GrpcMethod('ClientesService', 'getClientesById')
  async getClientesById(
    request: __project_name_kebab__.Get__project_name_pascal__ByIdDto
  ): Promise<__project_name_kebab__.__project_name_pascal__> {
    const query = new Get__project_name_pascal__ByIdQuery({ id: request.id })

    const entity = await this.queryBus.execute(query)

    return this.mapper.entityToProto(entity)
  }
}
