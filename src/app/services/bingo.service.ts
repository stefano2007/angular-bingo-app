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
   */
  iniciarNovoJogo(numeroMaximo: number = 75): void {
    // Garante que numeroMaximo seja múltiplo de 5
    if (numeroMaximo % 5 !== 0) {
      numeroMaximo = Math.ceil(numeroMaximo / 5) * 5;
    }

    // Gera array de números de 1 até numeroMaximo
    const numeros = Array.from({ length: numeroMaximo }, (_, i) => i + 1);

    this.estadoJogo.set({
      numeroMaximo,
      numeros: numeros,
      numerosSelecionados: [],
      numeroAtual: null
    });

    // Remove jogo salvo ao iniciar novo jogo
    this.limparJogoSalvo();
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

