import { type ProjectOptions } from '@schemifyjs/types'
import path from 'path'
import { execa } from 'execa'
import { copyTemplate } from '../utils/copy-template.js'
import { replacePlaceholders } from '../utils/replace-placeholders.js'
import { verifyNoPlaceholders } from '../utils/verify-no-placeholders.js'

import { ScaffoldingContext } from './config/version.js'
/**
 * Clase que orquesta el proceso de scaffolding de proyectos.
 * Sigue el principio SRP y delega trabajo a utilidades.
 */
export class ProjectScaffolder {
  constructor(private readonly versionReader = ScaffoldingContext) {}

  async scaffold(options: ProjectOptions): Promise<void> {
    const projectPath = path.resolve(options.name)
    await copyTemplate(options)

    const replacements = {
      ...this.generateNameVariants(options.name),
      ...this.versionReader.getSchemifyVersions()
    }

    replacePlaceholders(projectPath, replacements)
    await verifyNoPlaceholders(projectPath)
    await this.runInstall(projectPath)
  }

  private async runInstall(cwd: string): Promise<void> {
    await execa('npm', ['install'], { cwd, stdio: 'inherit' })
  }

  private generateNameVariants(name: string): Record<string, string> {
    const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)
    const snake = name.replace(/-/g, '_')
    const screamingSnake = snake.toUpperCase()

    return {
      projectName: name,
      projectNameCamel: camel,
      ProjectName: pascal,
      project_name: snake,
      PROJECT_NAME: screamingSnake
    }
  }
}
