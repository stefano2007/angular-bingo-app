import { Component } from '@angular/core';
import { BingoService } from './services/bingo.service';
import { BingoBoardComponent } from './components/bingo-board/bingo-board.component';
import { BingoControlsComponent } from './components/bingo-controls/bingo-controls.component';

/**
 * Componente principal da aplicação
 * Integra o serviço de Bingo com os componentes de interface
 */
@Component({
  selector: 'app-root',
  imports: [BingoBoardComponent, BingoControlsComponent],
  templateUrl: './app.html'
})
export class App {
  constructor(private bingoService: BingoService) {
    // O serviço já carrega o jogo salvo no construtor
  }

  // Expõe o signal do estado do jogo diretamente para uso no template
  get gameState() {
    return this.bingoService.state;
  }

  /**
   * Manipula o evento de novo jogo
   * @param maxNumber Número máximo para o novo jogo
   */
  onNewGame(maxNumber: number): void {
    this.bingoService.startNewGame(maxNumber);
  }

  /**
   * Manipula o evento de gerar número
   */
  onGenerateNumber(): void {
    this.bingoService.generateNumber();
  }

  /**
   * Manipula o evento de salvar jogo
   */
  onSaveGame(): void {
    this.bingoService.saveGame();
  }
}
