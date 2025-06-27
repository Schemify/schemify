import { IQuery } from '@nestjs/cqrs'

export class GetMicromicroByIdQuery implements IQuery {
  constructor(
    /**
     * Payload de la query
     * @property id ID único del Micromicro a buscar
     */
    public readonly payload: { id: string }
  ) {}
}
