import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente responsável por exibir o placar do Bingo
 * Mostra os números em um grid 5xN com a palavra BINGO no topo
 */
@Component({
  selector: 'app-bingo-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bingo-board.component.html'
})
export class BingoBoardComponent {
  /**
   * Array de números do jogo (embaralhados)
   */
  @Input() numbers: number[] = [];

  /**
   * Array de números já selecionados
   */
  @Input() selectedNumbers: number[] = [];

  /**
   * Organiza os números em colunas para exibição
   * Cada coluna representa uma letra de BINGO (5 colunas)
   * @returns Array de arrays, onde cada array interno representa uma coluna
   */
  getColumns(): number[][] {
    const columns: number[][] = [[], [], [], [], []];
    
    this.numbers.forEach((num, index) => {
      const columnIndex = index % 5;
      columns[columnIndex].push(num);
    });

    return columns;
  }

  /**
   * Verifica se um número foi selecionado
   * @param number Número a ser verificado
   * @returns true se o número foi selecionado
   */
  isSelected(number: number): boolean {
    return this.selectedNumbers.includes(number);
  }

  /**
   * Retorna as letras de BINGO para o cabeçalho
   */
  getLetters(): string[] {
    return ['B', 'I', 'N', 'G', 'O'];
  }
}

