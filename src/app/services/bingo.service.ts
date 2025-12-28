import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Interface para o estado do jogo
 */
export interface BingoGameState {
  maxNumber: number;
  numbers: number[];
  selectedNumbers: number[];
  currentNumber: number | null;
}

/**
 * Serviço responsável por gerenciar a lógica do jogo de Bingo
 */
@Injectable({
  providedIn: 'root'
})
export class BingoService {
  private readonly STORAGE_KEY = 'bingo-game-state';
  private readonly platformId = inject(PLATFORM_ID);

  // Estado do jogo usando signals
  private gameState = signal<BingoGameState>({
    maxNumber: 75,
    numbers: [],
    selectedNumbers: [],
    currentNumber: null
  });

  // Expor o estado como signal readonly
  readonly state = this.gameState.asReadonly();

  constructor() {
    // Tenta carregar jogo salvo ao inicializar (apenas no browser)
    if (isPlatformBrowser(this.platformId)) {
      this.loadGame();
    } else {
      // No servidor, apenas inicia um novo jogo sem tentar carregar
      this.startNewGame(75);
    }
  }

  /**
   * Inicializa um novo jogo com o número máximo especificado
   * @param maxNumber Número máximo do jogo (deve ser múltiplo de 5)
   */
  startNewGame(maxNumber: number = 75): void {
    // Garante que maxNumber seja múltiplo de 5
    if (maxNumber % 5 !== 0) {
      maxNumber = Math.ceil(maxNumber / 5) * 5;
    }

    // Gera array de números de 1 até maxNumber
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

    this.gameState.set({
      maxNumber,
      numbers: numbers,
      selectedNumbers: [],
      currentNumber: null
    });

    // Remove jogo salvo ao iniciar novo jogo
    this.clearSavedGame();
  }

  /**
   * Gera um número aleatório ainda não selecionado
   * @returns Número gerado ou null se todos já foram selecionados
   */
  generateNumber(): number | null {
    const state = this.gameState();
    const availableNumbers = state.numbers.filter(
      num => !state.selectedNumbers.includes(num)
    );

    if (availableNumbers.length === 0) {
      return null; // Todos os números já foram selecionados
    }

    // Seleciona um número aleatório dos disponíveis
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];

    // Atualiza o estado
    this.gameState.set({
      ...state,
      selectedNumbers: [...state.selectedNumbers, selectedNumber],
      currentNumber: selectedNumber
    });

    // Salva automaticamente após gerar número
    this.saveGame();

    return selectedNumber;
  }

  /**
   * Salva o estado atual do jogo no LocalStorage
   */
  saveGame(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Não salva no servidor
    }

    try {
      const state = this.gameState();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
    }
  }

  /**
   * Carrega o jogo salvo do LocalStorage
   */
  loadGame(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // No servidor, apenas inicia um novo jogo
      this.startNewGame(75);
      return;
    }

    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const parsedState: BingoGameState = JSON.parse(savedState);
        // Valida o estado antes de aplicar
        if (this.isValidState(parsedState)) {
          this.gameState.set(parsedState);
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
    }

    // Se não houver jogo salvo ou houver erro, inicia novo jogo
    this.startNewGame(75);
  }

  /**
   * Verifica se o estado salvo é válido
   */
  private isValidState(state: any): state is BingoGameState {
    return (
      state &&
      typeof state.maxNumber === 'number' &&
      Array.isArray(state.numbers) &&
      Array.isArray(state.selectedNumbers) &&
      state.maxNumber % 5 === 0 &&
      state.maxNumber >= 5 &&
      state.maxNumber <= 120
    );
  }

  /**
   * Limpa o jogo salvo do LocalStorage
   */
  private clearSavedGame(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Não limpa no servidor
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar jogo salvo:', error);
    }
  }
}

