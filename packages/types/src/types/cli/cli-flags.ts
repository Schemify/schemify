import { FrameworkType, PackageManagerType } from '../project-options.js'

export interface CLIFlags {
  name?: string
  pm?: PackageManagerType
  framework?: FrameworkType
}
