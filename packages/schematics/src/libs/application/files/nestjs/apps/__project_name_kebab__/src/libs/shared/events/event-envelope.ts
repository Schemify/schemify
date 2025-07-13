export interface Envelope<T = unknown> {
  type: string // "__project_name_camel__Created"
  version: number // 1
  payload: T // datos de negocio
}
