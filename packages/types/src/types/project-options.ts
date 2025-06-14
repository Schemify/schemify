export enum TemplateType {
  Microservice = 'microservice'
  //   Grpc = "grpc",
  //   Kafka = "kafka",
}

export enum FrameworkType {
  NestJS = 'nestjs'
}

export enum PackageManagerType {
  Npm = 'npm'
  //   Yarn = "yarn",
  //   Pnpm = "pnpm",
}

export interface ProjectOptions {
  name: string
  template: TemplateType
  framework: FrameworkType
  packageManager: PackageManagerType
}
