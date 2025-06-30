export type ArtifactType = 'microservice'
//   | 'dto'
//   | 'event'
//   | 'handler'
//   | 'service'
//   | 'interface'
//   | 'enum'
//   | 'pipe'
//   | 'filter'
//   | 'middleware'
//   | 'resolver'

export interface MicroserviceOptions {
  type: ArtifactType
  name: string
}
