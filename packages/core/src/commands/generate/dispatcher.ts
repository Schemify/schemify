// import { GenerateArtifactOptions, ArtifactType } from '@schemifyjs/types'
// import { MicroserviceScaffolder } from '@schemifyjs/schematics'

// type ScaffolderConstructor = {
//   [K in ArtifactType]: new () => {
//     scaffold: (options: GenerateArtifactOptions) => Promise<void>
//   }
// }

// const scaffolders: ScaffolderConstructor = {
//   microservice: MicroserviceScaffolder
// }

// export async function dispatchGenerateScaffolder(
//   options: GenerateArtifactOptions
// ): Promise<void> {
//   const Scaffolder = scaffolders[options.type]

//   if (!Scaffolder) {
//     throw new Error(`Unsupported artifact type: ${options.type}`)
//   }

//   const scaffolder = new Scaffolder()
//   await scaffolder.scaffold(options)
// }
