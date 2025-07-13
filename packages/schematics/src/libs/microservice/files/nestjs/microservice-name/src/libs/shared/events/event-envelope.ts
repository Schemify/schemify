export interface Envelope<T = unknown> {
  type: string // "MicroserviceNameCreated"
  version: number // 1
  payload: T // datos de negocio
}
