import { IQuery } from '@nestjs/cqrs'

export class GetMicromicroByCursorQuery implements IQuery {
  constructor(
    /**
     * Parámetros para paginación cursor-based
     * @property afterId ID desde el cual continuar la búsqueda
     * @property limit Número máximo de resultados a retornar
     */
    public readonly payload: { afterId: string; limit: number }
  ) {}
}
