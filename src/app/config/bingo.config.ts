/**
 * Configurações globais do Bingo
 */

/**
 * Números máximos válidos para o jogo de Bingo
 * São múltiplos de 5 dentro do range permitido
 */
export const NUMEROS_MAXIMOS_VALIDOS = [75, 80, 85, 90, 95, 100, 105, 110, 115, 120] as const;

/**
 * Tipo para os números máximos válidos
 */
export type NumeroMaximoValido = (typeof NUMEROS_MAXIMOS_VALIDOS)[number];

/**
 * Função utilitária para validar se um número é um máximo válido
 */
export function ehNumeroMaximoValido(numero: unknown): numero is NumeroMaximoValido {
  return NUMEROS_MAXIMOS_VALIDOS.includes(numero as any);
}

/**
 * Função para obter o número máximo padrão
 */
export function obterNumeroMaximoSelecionado(value: unknown): NumeroMaximoValido {
  if (ehNumeroMaximoValido(value)) {
    return value;
  }
  return NUMEROS_MAXIMOS_VALIDOS[0]; // 75 é o padrão
}
