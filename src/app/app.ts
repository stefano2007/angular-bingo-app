import { Component, Inject, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Componente principal da aplicação
 * Gerencia layout geral e navegação
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    afterNextRender(() => {
      this.aplicarTemaDark();
    });
  }

  /**
   * Aplica tema dark na raiz da aplicação
   */
  private aplicarTemaDark(): void {
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = this.document.documentElement;
      htmlElement.classList.add('dark');
    }
  }
}
