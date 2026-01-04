import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BingoCardGeneratorService } from '../../services/bingo-card-generator.service';
import { BingoCardComponent } from '../bingo-card/bingo-card.component';
import { NUMEROS_MAXIMOS_VALIDOS, ehNumeroMaximoValido, obterNumeroMaximoSelecionado } from '../../config/bingo.config';
import type { BingoCard } from '../../services/bingo-card-generator.service';

@Component({
  selector: 'app-cartela-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BingoCardComponent],
  templateUrl: './cartela-generator.component.html',
  styleUrls: ['./cartela-generator.component.css']
})
export class CartelaGeneratorComponent {
  private cardGeneratorService = inject(BingoCardGeneratorService);
  private activatedRoute = inject(ActivatedRoute);

  bingoName = signal('BINGO');
  quantidade = signal(30);
  imageUrl = signal('');
  numeroMaximo = signal(75);
  cartelas = signal<BingoCard[]>([]);

  // Converte para array mutável para uso no template
  readonly numerosMaximosValidos: number[] = Array.from(NUMEROS_MAXIMOS_VALIDOS);

  constructor() {
    this.lerParametrosQuery();
  }

  private lerParametrosQuery(): void {
    this.activatedRoute.queryParams.subscribe((params: Record<string, string>) => {
      const numeroMaximo = parseInt(params['numeroMaximo'] || '75', 10);
      if (ehNumeroMaximoValido(numeroMaximo)) {
        this.numeroMaximo.set(numeroMaximo);
      }
    });
  }

  gerarCartelas() {
    const cards = this.cardGeneratorService.gerarCartelas(this.quantidade(), this.numeroMaximo());
    this.cartelas.set(cards);
  }

  imprimir() {
    window.print();
  } 

  onNumeroMaximoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const valor = parseInt(target.value, 10);
    this.numeroMaximo.set(valor);
  }
}
