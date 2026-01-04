import { Routes } from '@angular/router';
import { BingoGameComponent } from './components/bingo-game/bingo-game.component';
import { CartelaGeneratorComponent } from './components/cartela-generator/cartela-generator.component';

export const routes: Routes = [
  { path: '', component: BingoGameComponent },
  { path: 'cartelas', component: CartelaGeneratorComponent },
  { path: '**', redirectTo: '' }
];
