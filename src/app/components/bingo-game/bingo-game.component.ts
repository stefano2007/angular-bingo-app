import { Component, Inject, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BingoService } from '../../services/bingo.service';
import { BingoBoardComponent } from '../bingo-board/bingo-board.component';
import { BingoControlsComponent } from '../bingo-controls/bingo-controls.component';
import { NumbersScoreboardComponent } from '../numbers-scoreboard/numbers-scoreboard.component';
import { NUMEROS_MAXIMOS_VALIDOS, ehNumeroMaximoValido } from '../../config/bingo.config';

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
  numeroMaximoEmModal = signal(75);
  jogoJaIniciado = computed(() => this.bingoService.estado().numerosSelecionados.length > 0);

  get estadoJogo() {
    return this.bingoService.estado;
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
