import { Component, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BingoService } from '../../services/bingo.service';
import { BingoBoardComponent } from '../../components/bingo-board/bingo-board.component';
import { BingoControlsComponent } from '../../components/bingo-controls/bingo-controls.component';
import { NumbersScoreboardComponent } from '../../components/numbers-scoreboard/numbers-scoreboard.component';
import { NUMEROS_MAXIMOS_VALIDOS, NUMERO_JOGAS_PADRAO, ehNumeroMaximoValido } from '../../config/bingo.config';

/**
 * Componente que contém o jogo de bingo
 */
@Component({
  selector: 'app-bingo-game',
  standalone: true,
  imports: [BingoBoardComponent, BingoControlsComponent, NumbersScoreboardComponent, CommonModule, FormsModule],
  templateUrl: './bingo-game.component.html',
  styleUrls: ['./bingo-game.component.css']
})
export class BingoGameComponent {
  private bingoService = inject(BingoService);
  private activatedRoute = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  mostrarModalNovoJogo = signal(false);
  numeroMaximoEmModal = signal(NUMERO_JOGAS_PADRAO);
  jogoJaIniciado = computed(() => this.bingoService.estadoSoLeitura().numerosSelecionados.length > 0
    && this.bingoService.estadoSoLeitura().numerosSelecionados.length < this.bingoService.estadoSoLeitura().numeroMaximo);

  get estadoJogo() {
    return this.bingoService.estadoSoLeitura;
  }

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.lerParametrosQuery();
      }
    });
  }

  private lerParametrosQuery(): void {
    this.activatedRoute.queryParams.subscribe((params: Record<string, string>) => {
      // Só inicia novo jogo se houver numeroMaximo na query, caso contrário carrega jogo salvo
      if (params['numeroMaximo']) {
        const numeroMaximo = parseInt(params['numeroMaximo'], 10);
        if (this.ehValido(numeroMaximo)) {
          this.numeroMaximoEmModal.set(numeroMaximo);
          this.iniciarJogo(numeroMaximo);
        }
      }
    });
  }

  private ehValido(numeroMaximo: number): boolean {
    return ehNumeroMaximoValido(numeroMaximo);
  }

  private iniciarJogo(numeroMaximo: number): void {
    this.bingoService.iniciarNovoJogo(numeroMaximo);
  }

  confirmarNovoJogoModal(numeroMaximo: number): void {
    this.cancelarModalNovoJogo();
    this.iniciarJogo(numeroMaximo);
  }

  cancelarModalNovoJogo(): void {
    this.mostrarModalNovoJogo.set(false);
  }

  aoNovoJogo(numeroMaximo: number): void {
    this.numeroMaximoEmModal.set(numeroMaximo);

    // Se há jogo em andamento, mostrar alert nativo
    if (this.jogoJaIniciado()) {
      const confirmou = confirm(
        `⚠️ Você tem um jogo em andamento com ${this.estadoJogo().numerosSelecionados.length} números sorteados.\n\nDeseja realmente iniciar um novo jogo?`
      );
      if (confirmou) {
        this.mostrarModalNovoJogo.set(true);
      }
    } else {
      this.mostrarModalNovoJogo.set(true);
    }
  }

  aoGerarNumero(): void {
    this.bingoService.gerarNumero();
  }

  get NUMEROS_MAXIMOS_VALIDOS(): number[] {
    return Array.from(NUMEROS_MAXIMOS_VALIDOS);
  }
}
