import { execa } from 'execa'

export async function runInstallCommand(cwd: string): Promise<void> {
  await execa('npm', ['install'], { cwd, stdio: 'inherit' })
}
