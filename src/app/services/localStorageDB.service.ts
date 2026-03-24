import { Injectable } from "@angular/core";
import { EstadoJogoBingo } from "./bingo.service";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageDBService {

  private readonly CHAVE_STORAGE = 'bingo-game-state';

   /**
   * Salva o estado atual do jogo no LocalStorage
   */
  salvarJogo(estadoJogo: EstadoJogoBingo): void {
    try {
      localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(estadoJogo));
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
    }
  }

   /**
   * Carrega o jogo salvo do LocalStorage
   */
  carregarJogo(): EstadoJogoBingo | undefined {
    try {
      const estadoSalvo = localStorage.getItem(this.CHAVE_STORAGE);
      if (estadoSalvo) {
        return JSON.parse(estadoSalvo) as EstadoJogoBingo;
      }
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
    }

    return undefined;
  }

   /**
   * Limpa o jogo salvo do LocalStorage
   */
  limparJogoSalvo(): void {
    try {
      localStorage.removeItem(this.CHAVE_STORAGE);
    } catch (error) {
      console.error('Erro ao limpar jogo salvo:', error);
    }
  }

}