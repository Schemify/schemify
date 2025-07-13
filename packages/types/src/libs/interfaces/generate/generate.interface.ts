// import { type BaseArtifactOptions } from '../../../shared/interfaces/base-artifact-options.interface.js'

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

export interface GenerateCommandOptions {
  type: ArtifactType
  name: string
}
export interface GenerateArtifactOptions extends GenerateCommandOptions {
  // BaseArtifactOptions
}
