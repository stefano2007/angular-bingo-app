import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NUMEROS_MAXIMOS_VALIDOS, NUMERO_JOGAS_PADRAO } from '../../config/bingo.config';

/**
 * Componente responsável pelos controles do jogo
 * Contém botões para novo jogo e gerar/sortear número
 */
@Component({
  selector: 'app-bingo-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bingo-controls.component.html'
})
export class BingoControlsComponent {
  
  /**
   * Número máximo selecionado (para exibição readonly)
   */
  @Input() numeroMaximoSelecionado: number = NUMERO_JOGAS_PADRAO;

  /**
   * Quantidade de números selecionados
   */
  @Input() quantidadeSelecionados: number = 0;

  /**
   * Quantidade total de números no jogo
   */
  @Input() totalNumeros: number = NUMERO_JOGAS_PADRAO;

  /**
   * Evento emitido quando o usuário deseja iniciar um novo jogo
   */
  @Output() novoJogo = new EventEmitter<number>();

  /**
   * Evento emitido quando o usuário deseja gerar um novo número
   */
  @Output() gerarNumero = new EventEmitter<void>();

  /**
   * Opções disponíveis para o número máximo (múltiplos de 5)
   */
  readonly opcoesNumeroMaximo = NUMEROS_MAXIMOS_VALIDOS;

  /**
   * Emite evento para iniciar novo jogo usando o numeroMaximoSelecionado
   */
  criarNovoJogo(): void {
    this.novoJogo.emit(this.numeroMaximoSelecionado);
  }

  /**
   * Emite evento para gerar número
   */
  sortearNumero(): void {
    this.gerarNumero.emit();
  }

  /**
   * Verifica se ainda há números disponíveis para sortear
   */
  get podeSortearNumero(): boolean {
    return this.quantidadeSelecionados < this.totalNumeros;
  }

  /**
   * Calcula a porcentagem de números selecionados
   */
  get porcentagemProgresso(): number {
    if (this.totalNumeros === 0) return 0;
    return Math.round((this.quantidadeSelecionados / this.totalNumeros) * 100);
  }
}
