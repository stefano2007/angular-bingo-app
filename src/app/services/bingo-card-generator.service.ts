/**
 * Interface para representar uma cartela de bingo
 */
export interface BingoCard {
  id: number;
  numbers: number[][];
}

import { Injectable } from '@angular/core';

/**
 * Serviço responsável por gerar cartelas de bingo
 */
@Injectable({
  providedIn: 'root'
})
export class BingoCardGeneratorService {
  /**
   * Gera uma cartela de bingo com números aleatórios organizados por coluna
   * Cada coluna tem um intervalo específico de números
   * B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75 (para 75)
   * Os intervalos são escaláveis para diferentes números máximos
   * @param numeroMaximo Número máximo para a cartela (75, 80, 85, etc)
   * @returns Array 5x5 com números da cartela
   */
  private generateCard(numeroMaximo: number): number[][] {
    // Calcula os intervalos baseado no numeroMaximo
    const intervalo = Math.floor(numeroMaximo / 5);
    const colunas = [
      this.gerarNumerosColuna(1, intervalo),
      this.gerarNumerosColuna(intervalo + 1, intervalo * 2),
      this.gerarNumerosColuna(intervalo * 2 + 1, intervalo * 3),
      this.gerarNumerosColuna(intervalo * 3 + 1, intervalo * 4),
      this.gerarNumerosColuna(intervalo * 4 + 1, numeroMaximo)
    ];

    const cartela: number[][] = [];
    for (let linha = 0; linha < 5; linha++) {
      const novaLinha: number[] = [];
      for (let coluna = 0; coluna < 5; coluna++) {
        novaLinha.push(colunas[coluna][linha]);
      }
      cartela.push(novaLinha);
    }

    return cartela;
  }

  /**
   * Gera números aleatórios para uma coluna específica
   * @param min Valor mínimo
   * @param max Valor máximo
   * @returns Array com 5 números aleatórios únicos
   */
  private gerarNumerosColuna(min: number, max: number): number[] {
    const numeros: number[] = [];
    const disponíveis = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    for (let i = 0; i < 5; i++) {
      const indiceAleatorio = Math.floor(Math.random() * disponíveis.length);
      numeros.push(disponíveis[indiceAleatorio]);
      disponíveis.splice(indiceAleatorio, 1);
    }

    return numeros;
  }

  /**
   * Gera múltiplas cartelas de bingo
   * @param quantidade Número de cartelas a gerar
   * @param numeroMaximo Número máximo para as cartelas (padrão: 75)
   * @returns Array de cartelas
   */
  gerarCartelas(quantidade: number, numeroMaximo: number = 75): BingoCard[] {
    const cartelas: BingoCard[] = [];

    for (let i = 0; i < quantidade; i++) {
      cartelas.push({
        id: i + 1,
        numbers: this.generateCard(numeroMaximo)
      });
    }

    console.log('cartelas geradas:', cartelas);
    return cartelas;
  }
}
