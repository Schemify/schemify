export interface Envelope<T = unknown> {
  type: string // "MicromicroCreated"
  version: number // 1
  payload: T // datos de negocio
}
