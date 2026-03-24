/**
 * Configurações globais do Bingo
 */

/**
 * Números máximos válidos para o jogo de Bingo
 * São múltiplos de 5 dentro do range permitido
 */
export const NUMEROS_MAXIMOS_VALIDOS = [75, 80, 85, 90, 95, 100, 105, 110, 115, 120] as const;


/**
 * Numero padrao de jogadas deve ser a primeir posição do array NUMEROS_MAXIMOS_VALIDOS
 */
export const NUMERO_JOGAS_PADRAO: number = NUMEROS_MAXIMOS_VALIDOS[0];

/**
 * Nome padrão do jogo
 */
export const NOME_JOGO_PADRAO: string = 'BINGO';

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
 * Valores padrão de linhas para gerar os cartelas do bingo
 */
export const MAX_NUMERO_LINHAS: number = 5 as const;
/**
 * Valores padrão de colunas para gerar os cartelas do bingo
 */
export const MAX_NUMERO_COLUNAS: number = 5 as const;