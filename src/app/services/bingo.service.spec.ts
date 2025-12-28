import { TestBed } from '@angular/core/testing';
import { BingoService } from './bingo.service';

describe('BingoService', () => {
  let service: BingoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BingoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('organizarNumerosEmColunaBingo', () => {
    it('should organize 15 numbers in column format correctly', () => {
      // Test com 15 números (3 linhas x 5 colunas)
      service.iniciarNovoJogo(15);
      const estado = service.estado();
      
      // Array esperado quando é iterado com obterColunas():
      // obterColunas() faz: indiceColuna = indice % 5
      // Índice 0 % 5 = coluna 0
      // Índice 1 % 5 = coluna 1
      // ... 
      // Índice 5 % 5 = coluna 0 (próximo número da coluna 0)
      //
      // Resultado esperado:
      // [1, 4, 7, 10, 13, 2, 5, 8, 11, 14, 3, 6, 9, 12, 15]
      // Quando exibido:
      // Coluna 0: [1, 2, 3] (índices 0, 5, 10)
      // Coluna 1: [4, 5, 6] (índices 1, 6, 11)
      // Coluna 2: [7, 8, 9] (índices 2, 7, 12)
      // Coluna 3: [10, 11, 12] (índices 3, 8, 13)
      // Coluna 4: [13, 14, 15] (índices 4, 9, 14)
      //
      // E no template fica:
      // B I N G O
      // 1 4 7 10 13
      // 2 5 8 11 14
      // 3 6 9 12 15
      
      const esperado = [1, 4, 7, 10, 13, 2, 5, 8, 11, 14, 3, 6, 9, 12, 15];
      expect(estado.numeros).toEqual(esperado);
    });

    it('should organize 75 numbers correctly', () => {
      // Test com 75 números (15 linhas x 5 colunas)
      service.iniciarNovoJogo(75);
      const estado = service.estado();
      
      // Verificar quantidade correta
      expect(estado.numeros.length).toBe(75);
      
      // Verificar que contém todos os números de 1 a 75
      const ordenados = [...estado.numeros].sort((a, b) => a - b);
      expect(ordenados).toEqual(Array.from({ length: 75 }, (_, i) => i + 1));
      
      // Verificar a estrutura: quando exibido em 5 colunas
      // Coluna 0 deve ter os números [1, 2, 3, ..., 15] (índices 0, 5, 10, 15, ...)
      const coluna0 = [];
      for (let i = 0; i < estado.numeros.length; i += 5) {
        coluna0.push(estado.numeros[i]);
      }
      expect(coluna0).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
      
      // Coluna 1 deve ter os números [16, 17, 18, ..., 30] (índices 1, 6, 11, 16, ...)
      const coluna1 = [];
      for (let i = 1; i < estado.numeros.length; i += 5) {
        coluna1.push(estado.numeros[i]);
      }
      expect(coluna1).toEqual(Array.from({ length: 15 }, (_, i) => i + 16));
    });

    it('should organize 100 numbers correctly', () => {
      // Test com 100 números (20 linhas x 5 colunas)
      service.iniciarNovoJogo(100);
      const estado = service.estado();
      
      // Verificar quantidade correta
      expect(estado.numeros.length).toBe(100);
      
      // Verificar a estrutura de colunas
      const coluna0 = [];
      for (let i = 0; i < estado.numeros.length; i += 5) {
        coluna0.push(estado.numeros[i]);
      }
      // Coluna 0 deve ter os números 1-20
      expect(coluna0).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
      
      // Coluna 1 deve ter os números 21-40
      const coluna1 = [];
      for (let i = 1; i < estado.numeros.length; i += 5) {
        coluna1.push(estado.numeros[i]);
      }
      expect(coluna1).toEqual(Array.from({ length: 20 }, (_, i) => i + 21));
    });
  });
});
