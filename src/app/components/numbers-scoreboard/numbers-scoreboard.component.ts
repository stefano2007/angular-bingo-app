import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente responsável por exibir um placar com os números já sorteados
 */
@Component({
  selector: 'app-numbers-scoreboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './numbers-scoreboard.component.html',
  styleUrls: ['./numbers-scoreboard.component.css']
})
export class NumbersScoreboardComponent {
  /**
   * Número atual selecionado
   */
  @Input() numeroAtual: number | null = null;
  
  /**
   * Array com os números já sorteados
   */
  @Input() numerosSelecionados: number[] = [];

  /**
   * Coluna do número atual sorteado (B, I, N, G ou O)
   */
  @Input() numeroColuna: string | null = null;
}
