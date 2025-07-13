import { type MicroserviceArtifactOptions } from '../../../shared/interfaces/artifacts/microservice.interface.js'

export enum FrameworkType {
  NestJS = 'nestjs'
  // Express = 'express'
}

export enum PackageManagerType {
  Npm = 'npm'
  //   Yarn = "yarn",
  //   Pnpm = "pnpm",
}

export interface BaseArtifactOptions {
  framework: FrameworkType
  packageManager: PackageManagerType
  versions?: Record<string, string>
}

export interface ProjectMetadata {
  name: string
  path?: string
}

export interface NewProjectOptions extends BaseArtifactOptions {
  metadata: ProjectMetadata
  microservice?: MicroserviceArtifactOptions
}
