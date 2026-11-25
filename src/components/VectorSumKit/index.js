import {mathNumber} from '../mathviz/Formula';

// Ferramentas comuns às figuras da lição 7.29 (soma de vetores e
// multiplicação por número). Não é um componente: só funções de texto.

// Um par de coordenadas em LaTeX, na notação da casa: vírgula entre as
// coordenadas, ou ponto e vírgula quando alguma delas tem vírgula decimal.
// (6, 8) → '(6,\\ 8)'; (3.5, 4) → '(3{,}5;\\ 4)'.
export function pairMath(x, y, digits = 2) {
  const a = mathNumber(x, digits);
  const b = mathNumber(y, digits);
  const sep = a.includes('{,}') || b.includes('{,}') ? ';' : ',';
  return `(${a}${sep}\\ ${b})`;
}

// Número em LaTeX, entre parênteses quando é negativo (para aparecer depois
// de um sinal: 3 + (−1)).
export function signedMath(value, digits = 2) {
  const s = mathNumber(value, digits);
  return value < 0 ? `(${s})` : s;
}

// Número em texto comum (botões, rótulos de controle): vírgula decimal e o
// sinal de menos tipográfico.
export function plainNumber(value, digits = 2) {
  return mathNumber(value, digits).replace('{,}', ',').replace('-', '−');
}
