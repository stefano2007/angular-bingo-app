import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageDBService } from './localStorageDB.service';
import { NUMERO_JOGAS_PADRAO, MAX_NUMERO_COLUNAS, MAX_NUMERO_LINHAS } from '../config/bingo.config'

/**
 * Interface para o estado do jogo
 */
export interface EstadoJogoBingo {
  numeroMaximo: number;
  numeros: number[];
  numerosSelecionados: number[];
  numeroAtual: number | null;
}

/**
 * Serviço responsável por gerenciar a lógica do jogo de Bingo
 */
@Injectable({
  providedIn: 'root'
})
export class BingoService {

  private localStorageDBService = inject(LocalStorageDBService);

  // Estado do jogo usando signals
  private estadoJogo = signal<EstadoJogoBingo>({
    numeroMaximo: NUMERO_JOGAS_PADRAO,
    numeros: [],
    numerosSelecionados: [],
    numeroAtual: null
  });

  // Expor o estado como signal readonly
  readonly estadoSoLeitura = this.estadoJogo.asReadonly();

  private readonly idPlataforma = inject(PLATFORM_ID);

  constructor() {
    // Tenta carregar jogo salvo ao inicializar (apenas no browser)
    if (this.ehBrowser()) {
      this.carregarJogo();
    } else {
      this.novoJogoPadrao();
    }
  }

  novoJogoPadrao(): void {
    this.iniciarNovoJogo(NUMERO_JOGAS_PADRAO);
  }

  ehBrowser(): boolean {
    return isPlatformBrowser(this.idPlataforma);
  }

  carregarJogo(): void {
    try {
      const estadoSalvo: EstadoJogoBingo | undefined = this.localStorageDBService.carregarJogo();
      if (estadoSalvo) {
        const estadoParseado: EstadoJogoBingo = estadoSalvo as EstadoJogoBingo;
        // Valida o estado antes de aplicar
        if (this.estadoValido(estadoParseado)) {
          this.estadoJogo.set(estadoParseado);
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
    }

    // Se não houver jogo salvo ou houver erro, inicia novo jogo
    this.novoJogoPadrao();
  }


  /**
   * Inicializa um novo jogo com o número máximo especificado
   * @param numeroMaximo Número máximo do jogo (deve ser múltiplo de 5)
   * @param limparHistorico Se true, remove o jogo salvo. Se false, apenas atualiza o estado
   */
  iniciarNovoJogo(numeroMaximo: number, limparHistoricoLocalStorage: boolean = true): void {
    // Garante que numeroMaximo seja múltiplo de 5
    if (numeroMaximo % MAX_NUMERO_COLUNAS !== 0) {
      numeroMaximo = Math.ceil(numeroMaximo / MAX_NUMERO_COLUNAS) * MAX_NUMERO_COLUNAS;
    }

    // Gera array de números de 1 até numeroMaximo
    let numeros = Array.from({ length: numeroMaximo }, (_, i) => i + 1);

    // Reorganiza os números em formato de coluna para o bingo
    numeros = this.organizarNumerosEmColunaBingo(numeros);

    this.estadoJogo.set({
      numeroMaximo,
      numeros: numeros,
      numerosSelecionados: [],
      numeroAtual: null
    });

    // Remove jogo salvo apenas se o parâmetro indicar (ao iniciar novo jogo via modal)
    if (limparHistoricoLocalStorage && this.ehBrowser()) {
      this.localStorageDBService.limparJogoSalvo();
    }
  }

  /**
   * Gera um número aleatório ainda não selecionado
   * @returns Número gerado ou null se todos já foram selecionados
   */
  gerarNumero(): number | null {
    const estado = this.estadoJogo();
    const numerosDisponiveis = estado.numeros.filter(
      num => !estado.numerosSelecionados.includes(num)
    );

    if (numerosDisponiveis.length === 0) {
      return null; // Todos os números já foram selecionados
    }

    // Seleciona um número aleatório dos disponíveis
    const indiceAleatorio = Math.floor(Math.random() * numerosDisponiveis.length);
    const numeroSelecionado = numerosDisponiveis[indiceAleatorio];

    // Atualiza o estado
    this.estadoJogo.set({
      ...estado,
      numerosSelecionados: [...estado.numerosSelecionados, numeroSelecionado],
      numeroAtual: numeroSelecionado
    });

    // Salva automaticamente após gerar número
    this.localStorageDBService.salvarJogo(this.estadoJogo());

    return numeroSelecionado;
  }

  /**
   * Verifica se o estado salvo é válido
   */
  private estadoValido(estado: any): estado is EstadoJogoBingo {
    return (
      estado &&
      typeof estado.numeroMaximo === 'number' &&
      Array.isArray(estado.numeros) &&
      Array.isArray(estado.numerosSelecionados) &&
      estado.numeroMaximo % MAX_NUMERO_COLUNAS === 0 &&
      estado.numeroMaximo >= MAX_NUMERO_COLUNAS &&
      estado.numeroMaximo <= 120
    );
  }

  /**
   * Reorganiza os números em formato de coluna para o Bingo
   * Transforma um array linear em um array organizado por colunas
   * Exemplo: [1..15] -> [1, 4, 7, 10, 13, 2, 5, 8, 11, 14, 3, 6, 9, 12, 15]
   *
   * No Bingo, cada coluna tem numeroMaximo/5 números.
   * Esta função reorganiza os números para que quando exibidos em 5 colunas,
   * apareçam na ordem correta: primeira linha tem o 1º número de cada coluna,
   * segunda linha tem o 2º número de cada coluna, etc.
   *
   * @param numeros Array de números ordenados sequencialmente
   * @returns Array de números reorganizado em formato de coluna
   */
  private organizarNumerosEmColunaBingo(numeros: number[]): number[] {
    const totalNumeros = numeros.length;
    const numerosPorColuna = totalNumeros / MAX_NUMERO_COLUNAS;
    const resultado: number[] = [];

    // Para cada linha (número dentro de cada coluna)
    for (let linha = 0; linha < numerosPorColuna; linha++) {
      // Para cada coluna
      for (let coluna = 0; coluna < MAX_NUMERO_LINHAS; coluna++) {
        // Calcula o índice no array original
        const indiceOriginal = coluna * numerosPorColuna + linha;
        resultado.push(numeros[indiceOriginal]);
      }
    }
    return resultado;
  }

}

