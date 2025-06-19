// export enum TemplateType {
//   Microservice = 'microservice'
//   //   Grpc = "grpc",
//   //   Kafka = "kafka",
// }

export interface NewSchemify {
  name: string
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

export interface NewSchemifyOptions {
  framework: FrameworkType
  packageManager: PackageManagerType
}
