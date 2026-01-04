import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
  private readonly CHAVE_STORAGE = 'bingo-game-state';
  private readonly idPlataforma = inject(PLATFORM_ID);

  // Estado do jogo usando signals
  private estadoJogo = signal<EstadoJogoBingo>({
    numeroMaximo: 75,
    numeros: [],
    numerosSelecionados: [],
    numeroAtual: null
  });

  // Expor o estado como signal readonly
  readonly estado = this.estadoJogo.asReadonly();

  constructor() {
    // Tenta carregar jogo salvo ao inicializar (apenas no browser)
    if (isPlatformBrowser(this.idPlataforma)) {
      this.carregarJogo();
    } else {
      // No servidor, apenas inicia um novo jogo sem tentar carregar
      this.iniciarNovoJogo(75);
    }
  }

  /**
   * Inicializa um novo jogo com o número máximo especificado
   * @param numeroMaximo Número máximo do jogo (deve ser múltiplo de 5)
   * @param limparHistorico Se true, remove o jogo salvo. Se false, apenas atualiza o estado
   */
  iniciarNovoJogo(numeroMaximo: number = 75, limparHistorico: boolean = true): void {
    // Garante que numeroMaximo seja múltiplo de 5
    if (numeroMaximo % 5 !== 0) {
      numeroMaximo = Math.ceil(numeroMaximo / 5) * 5;
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
    if (limparHistorico) {
      this.limparJogoSalvo();
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
    this.salvarJogo();

    return numeroSelecionado;
  }

  /**
   * Salva o estado atual do jogo no LocalStorage
   */
  salvarJogo(): void {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return; // Não salva no servidor
    }

    try {
      const estado = this.estadoJogo();
      localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(estado));
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
    }
  }

  /**
   * Carrega o jogo salvo do LocalStorage
   */
  carregarJogo(): void {
    if (!isPlatformBrowser(this.idPlataforma)) {
      // No servidor, apenas inicia um novo jogo
      this.iniciarNovoJogo(75);
      return;
    }

    try {
      const estadoSalvo = localStorage.getItem(this.CHAVE_STORAGE);
      if (estadoSalvo) {
        const estadoParseado: EstadoJogoBingo = JSON.parse(estadoSalvo);
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
    this.iniciarNovoJogo(75);
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
      estado.numeroMaximo % 5 === 0 &&
      estado.numeroMaximo >= 5 &&
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
    const numerosPerColuna = totalNumeros / 5; // 5 colunas para BINGO
    const resultado: number[] = [];

    // Para cada linha (número dentro de cada coluna)
    for (let linha = 0; linha < numerosPerColuna; linha++) {
      // Para cada coluna
      for (let coluna = 0; coluna < 5; coluna++) {
        // Calcula o índice no array original
        const indiceOriginal = coluna * numerosPerColuna + linha;
        resultado.push(numeros[indiceOriginal]);
      }
    }

    return resultado;
  }

  /**
   * Limpa o jogo salvo do LocalStorage
   */
  private limparJogoSalvo(): void {
    if (!isPlatformBrowser(this.idPlataforma)) {
      return; // Não limpa no servidor
    }

    try {
      localStorage.removeItem(this.CHAVE_STORAGE);
    } catch (error) {
      console.error('Erro ao limpar jogo salvo:', error);
    }
  }
}

