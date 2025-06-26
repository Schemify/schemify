export interface NewSchemify {
  name: string
  outputPath?: string
}

export enum FrameworkType {
  NestJS = 'nestjs'
  // Express = 'express'
}

export enum PackageManagerType {
  Npm = 'npm'
  //   Yarn = "yarn",
  //   Pnpm = "pnpm",
}

export interface ApplicationOptions extends NewSchemify {
  framework: FrameworkType
  packageManager: PackageManagerType
  versions?: Record<string, string>
}
