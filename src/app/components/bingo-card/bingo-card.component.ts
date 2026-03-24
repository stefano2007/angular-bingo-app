import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingoCard } from '../../services/bingo-card-generator.service';
import { MAX_NUMERO_LINHAS, MAX_NUMERO_COLUNAS, NOME_JOGO_PADRAO } from '../../config/bingo.config';

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

  readonly VALOR_LOCAL_ICONE : number = -1;

  /**
   * Dados da cartela a ser exibida
   */
  @Input() card: BingoCard | null = null;

  /**
   * Nome do bingo a ser exibido no topo da cartela
   */
  @Input() bingoName: string = NOME_JOGO_PADRAO;

  /**
   * URL da imagem opcional para o centro da cartela
   */
  @Input() imageUrl: string | null = null;

  /**
   * Reorganiza a cartela para exibir números em coluna
   * Converte de linha-coluna para coluna-linha (como no bingo-board)
   * @returns Array 5x5 com números organizados por coluna
   */
  obterCartelaOrganizada(): number[][] {
    if (!this.card) return [];

    const numeros: number[] = [];
    this.card.numbers.forEach(linha => {
      linha.forEach(numero => {
        numeros.push(numero);
      });
    });

    // Reorganiza em 5 colunas (B, I, N, G, O)
    const colunas: number[][] = [[], [], [], [], []];
    numeros.forEach((num, indice) => {
      const indiceColuna = indice % MAX_NUMERO_COLUNAS;
      colunas[indiceColuna].push(num);
    });

    this.ordernarColunas(colunas);

    // Converte de volta para linhas
    const cartelaOrganizada: number[][] = [];
    for (let linha = 0; linha < MAX_NUMERO_LINHAS; linha++) {
      const novaLinha: number[] = [];
      for (let coluna = 0; coluna < MAX_NUMERO_COLUNAS; coluna++) {
        if (this.indexIcone(linha, coluna)) {
          // Centro representa a imagem
          novaLinha.push(this.VALOR_LOCAL_ICONE);
        } else {
          novaLinha.push(colunas[coluna][linha] || 0);
        }
      }
      cartelaOrganizada.push(novaLinha);
    }

    return cartelaOrganizada;
  }



  indexIcone(linha: number, coluna: number): boolean {
    const indiceColunaFree : number = 2;
    const indiceLinhaFree : number= 2;
    return linha === indiceLinhaFree && coluna === indiceColunaFree;
  }

  ordernarColunas(colunas: number[][]): number[][] {
    return colunas.map(coluna => this.ordernarArray(coluna));
  }

  ordernarArray(arr: number[]): number[] {
    return arr.sort((a, b) => a - b);
  }
}
