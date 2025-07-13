import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class PrintConsoleUseCase {
  private readonly logger = new Logger(PrintConsoleUseCase.name)

  /**
   * Imprime cualquier objeto recibido por consola con formato estructurado.
   * @param payload Objeto o evento a imprimir
   */
  async execute(payload: unknown): Promise<void> {
    this.logger.log('Evento recibido:')
    this.logger.debug(JSON.stringify(payload, null, 2))
  }
}
