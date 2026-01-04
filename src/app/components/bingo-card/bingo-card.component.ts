import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingoCard } from '../../services/bingo-card-generator.service';

/**
 * Componente que exibe uma cartela de bingo individual
 */
@Component({
  selector: 'app-bingo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bingo-card.component.html',
  styleUrls: ['./bingo-card.component.css']
})
export class BingoCardComponent {
  /**
   * Dados da cartela a ser exibida
   */
  @Input() card: BingoCard | null = null;

  /**
   * Nome do bingo a ser exibido no topo da cartela
   */
  @Input() bingoName: string = 'BINGO';

  /**
   * URL da imagem opcional para o centro da cartela
   */
  @Input() imageUrl: string | null = null;

  /**
   * Colunas do bingo (B, I, N, G, O)
   */
  readonly colunas = ['B', 'I', 'N', 'G', 'O'];

  /**
   * Reorganiza a cartela para exibir números em coluna
   * Converte de linha-coluna para coluna-linha (como no bingo-board)
   * @returns Array 5x5 com números organizados por coluna
   */
  obterCartelaOrganizada(): number[][] {
    if (!this.card) return [];

    // Cria um array plano de todos os números (exceto o FREE)
    const numeros: number[] = [];
    this.card.numbers.forEach(linha => {
      linha.forEach(numero => {
        if (numero !== 0) {
          numeros.push(numero);
        }
      });
    });

    // Reorganiza em 5 colunas (B, I, N, G, O)
    const colunas: number[][] = [[], [], [], [], []];
    numeros.forEach((num, indice) => {
      const indiceColuna = indice % 5;
      colunas[indiceColuna].push(num);
    });

    // Converte de volta para linhas
    const cartelaOrganizada: number[][] = [];
    for (let linha = 0; linha < 5; linha++) {
      const novaLinha: number[] = [];
      for (let coluna = 0; coluna < 5; coluna++) {
        if (this.indexIcone(linha, coluna)) {
          // Centro é FREE (representado por 0)
          novaLinha.push(0);
        } else {
          novaLinha.push(colunas[coluna][linha] || 0);
        }
      }
      cartelaOrganizada.push(novaLinha);
    }

    return cartelaOrganizada;
  }

  indexIcone(linha: number, coluna: number): boolean {
    return linha === 2 && coluna === 2;
  }

  get nomePadraoBingo(): string {
    return 'FREE';
  }
}
