import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente responsável pelos controles do jogo
 * Contém botões para novo jogo, gerar número e salvar
 */
@Component({
  selector: 'app-bingo-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bingo-controls.component.html'
})
export class BingoControlsComponent {
  /**
   * Número máximo atual do jogo
   */
  @Input() maxNumber: number = 75;

  /**
   * Número atual selecionado
   */
  @Input() currentNumber: number | null = null;

  /**
   * Quantidade de números selecionados
   */
  @Input() selectedCount: number = 0;

  /**
   * Quantidade total de números no jogo
   */
  @Input() totalNumbers: number = 75;

  /**
   * Evento emitido quando o usuário deseja iniciar um novo jogo
   */
  @Output() newGame = new EventEmitter<number>();

  /**
   * Evento emitido quando o usuário deseja gerar um novo número
   */
  @Output() generateNumber = new EventEmitter<void>();

  /**
   * Evento emitido quando o usuário deseja salvar o jogo
   */
  @Output() saveGame = new EventEmitter<void>();

  /**
   * Valor temporário para o número máximo do novo jogo
   */
  newMaxNumber: number = 75;

  /**
   * Opções disponíveis para o número máximo (múltiplos de 5)
   */
  readonly maxNumberOptions: number[] = [75, 80, 85, 90, 95, 100, 105, 110, 115, 120];

  /**
   * Emite evento para iniciar novo jogo
   */
  onNewGame(): void {
    this.newGame.emit(this.newMaxNumber);
  }

  /**
   * Emite evento para gerar número
   */
  onGenerateNumber(): void {
    this.generateNumber.emit();
  }

  /**
   * Emite evento para salvar jogo
   */
  onSaveGame(): void {
    this.saveGame.emit();
  }

  /**
   * Verifica se ainda há números disponíveis para gerar
   */
  get canGenerateNumber(): boolean {
    return this.selectedCount < this.totalNumbers;
  }

  /**
   * Calcula a porcentagem de números selecionados
   */
  get progressPercentage(): number {
    if (this.totalNumbers === 0) return 0;
    return Math.round((this.selectedCount / this.totalNumbers) * 100);
  }
}

