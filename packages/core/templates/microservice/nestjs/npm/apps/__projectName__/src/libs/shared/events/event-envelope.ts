export interface Envelope<T = unknown> {
  type: string // "__ProjectName__Created"
  version: number // 1
  payload: T // datos de negocio
}
