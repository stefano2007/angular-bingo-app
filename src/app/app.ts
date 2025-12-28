import { Component, Inject, PLATFORM_ID, afterNextRender, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BingoService } from './services/bingo.service';
import { BingoBoardComponent } from './components/bingo-board/bingo-board.component';
import { BingoControlsComponent } from './components/bingo-controls/bingo-controls.component';
import { NumbersScoreboardComponent } from './components/numbers-scoreboard/numbers-scoreboard.component';

/**
 * Componente principal da aplicação
 * Integra o serviço de Bingo com os componentes de interface
 */
@Component({
  selector: 'app-root',
  imports: [BingoBoardComponent, BingoControlsComponent, NumbersScoreboardComponent, CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App {
  temaEscuro: boolean = false;
  mostrarModalNovoJogo = signal<boolean>(false);
  numeroMaximoEmModal = signal<number>(75);
  jogoJaIniciado = signal<boolean>(false);

  constructor(
    private servicoBingo: BingoService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute
  ) {
    // O serviço já carrega o jogo salvo no construtor
    // Carrega o tema após o DOM estar pronto
    afterNextRender(() => {
      this.carregarTema();
      this.lerParametrosQuery();
    });
  }

  // Expõe o signal do estado do jogo diretamente para uso no template
  get estadoJogo() {
    return this.servicoBingo.estado;
  }

  /**
   * Manipula o evento de novo jogo
   * @param numeroMaximo Número máximo para o novo jogo
   */
  aoNovoJogo(numeroMaximo: number): void {
    // Se jogo já iniciou, pede confirmação e abre modal
    if (this.jogoJaIniciado()) {
      const confirmacao = confirm('Um jogo já foi iniciado. Deseja iniciar um novo jogo?');
      if (confirmacao) {
        this.numeroMaximoEmModal.set(numeroMaximo);
        this.mostrarModalNovoJogo.set(true);
      }
    } else {
      // Se nenhum jogo iniciou, inicia direto
      this.servicoBingo.iniciarNovoJogo(numeroMaximo);
      this.jogoJaIniciado.set(true);
    }
  }

  /**
   * Confirma e inicia novo jogo do modal
   */
  confirmarNovoJogoModal(numeroMaximo: number): void {
    this.servicoBingo.iniciarNovoJogo(numeroMaximo);
    this.mostrarModalNovoJogo.set(false);
    this.jogoJaIniciado.set(true);
  }

  /**
   * Cancela o modal sem iniciar novo jogo
   */
  cancelarModalNovoJogo(): void {
    this.mostrarModalNovoJogo.set(false);
  }

  /**
   * Lê parâmetros de query da URL
   */
  private lerParametrosQuery(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.activatedRoute.queryParams.subscribe(params => {
      // Verifica se há parâmetro 'mode' ou 'numeroMaximo'
      const valorMode = params['mode'];
      const valorNumeroMaximo = params['numeroMaximo'];
      const valor = valorMode || valorNumeroMaximo;

      if (valor) {
        const numeroMaximo = parseInt(valor, 10);
        
        // Valida: múltiplo de 5 e dentro do range
        if (this.ehValido(numeroMaximo)) {
          this.numeroMaximoEmModal.set(numeroMaximo);
        }
      }
    });
  }

  /**
   * Valida se o número é múltiplo de 5 e está dentro do range permitido
   */
  private ehValido(numeroMaximo: number): boolean {
    const opcoesValidas = [75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
    return !isNaN(numeroMaximo) && opcoesValidas.includes(numeroMaximo);
  }

  /**
   * Manipula o evento de gerar número
   */
  aoGerarNumero(): void {
    this.servicoBingo.gerarNumero();
  }

  /**
   * Manipula o evento de salvar jogo
   */
  aoSalvarJogo(): void {
    this.servicoBingo.salvarJogo();
  }

  /**
   * Alterna entre tema claro e escuro
   */
  alternarTema(): void {
    this.temaEscuro = !this.temaEscuro;
    this.aplicarTema();
    this.salvarTema();
  }

  /**
   * Aplica o tema atual ao documento
   */
  private aplicarTema(): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = this.document.documentElement;
      if (this.temaEscuro) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }
  }

  /**
   * Carrega o tema salvo do localStorage
   */
  private carregarTema(): void {
    if (isPlatformBrowser(this.platformId)) {
      const temaSalvo = localStorage.getItem('bingo-tema');
      if (temaSalvo === 'dark') {
        this.temaEscuro = true;
      } else {
        this.temaEscuro = false;
      }
      this.aplicarTema();
    }
  }

  /**
   * Salva o tema atual no localStorage
   */
  private salvarTema(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bingo-tema', this.temaEscuro ? 'dark' : 'light');
    }
  }
}
