/**
 * Get__ProjectName__sByCursorQuery
 * -----------------------------------------------------------------------------
 * Query de lectura que solicita una página de registros `__ProjectName__Entity`
 * usando paginación basada en cursor (afterId + limit).
 *
 * Es procesada por `Get__ProjectName__sByCursorHandler`, quien consulta el repositorio
 * correspondiente y devuelve la estructura de paginación.
 */
import { IQuery } from '@nestjs/cqrs'

export class Get__ProjectName__sByCursorQuery implements IQuery {
  constructor(
    /**
     * Parámetros para paginación cursor-based
     * @property afterId ID desde el cual continuar la búsqueda
     * @property limit Número máximo de resultados a retornar
     */
    public readonly payload: { afterId: string; limit: number }
  ) {}
}
