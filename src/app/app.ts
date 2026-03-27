import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  constructor() {
  }

}
