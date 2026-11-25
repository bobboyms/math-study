import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {at, dec, pairTex} from '../mathviz/lineParam';

// A inclinação vem do diretor (lição 7.33, Retas com vetores).
//
// Dois controles escolhem o diretor d = (a, b). A reta passa por A e anda d a
// cada passo. Os dois primeiros passos aparecem como escadinhas: um trecho
// horizontal de tamanho a (azul) e um vertical de tamanho b (verde). A cada a
// para o lado, a reta anda b na vertical: a inclinação é b ÷ a. Com a = 0, a
// escada não anda para o lado, e a reta é vertical.

const txt = (v) => dec(v, 0).replace('-', '−');

const gcd = (x, y) => (y === 0 ? Math.abs(x) : gcd(y, x % y));

// b ÷ a como fração em LaTeX: primeiro com os números do jeito que estão,
// depois simplificada (sinal na frente, sem fator comum), quando muda.
function slopeTex(a, b) {
  const raw = `\\frac{${dec(b, 0)}}{${dec(a, 0)}}`;
  const g = gcd(b, a) || 1;
  const num = Math.abs(b) / g;
  const den = Math.abs(a) / g;
  const sign = a * b < 0 ? '-' : '';
  const simple = den === 1 ? `${sign}${num}` : `${sign}\\frac{${num}}{${den}}`;
  const same = den !== 1 && a > 0 && Math.abs(b) === num && a === den;
  return same ? raw : `${raw} = ${simple}`;
}

export default function SlopeSteps({
  A = [1, 2],
  xMin = -5,
  xMax = 7,
  yMin = -4,
  yMax = 8,
  xUnit = 28,
  initial = [2, 1],
  caption,
}) {
  const [d, setD] = useState(initial);
  const [a, b] = d;
  const zero = a === 0 && b === 0;

  const segments = [];
  const points = [{at: A, tone: 0, r: 4.5, label: 'A', dx: -14, dy: -12}];
  const lines = [];
  if (!zero) {
    lines.push({through: [A, at(A, d, 1)], muted: true});
    [0, 1].forEach((k) => {
      const start = at(A, d, k);
      const corner = [start[0] + a, start[1]];
      const end = at(A, d, k + 1);
      if (a !== 0) {
        segments.push({
          from: start,
          to: corner,
          tone: 1,
          label: k === 0 ? `a = ${dec(a, 0)}` : undefined,
          dx: 0,
          dy: b > 0 ? 16 : -12,
        });
      }
      if (b !== 0) {
        segments.push({
          from: corner,
          to: end,
          tone: 3,
          label: k === 0 ? `b = ${dec(b, 0)}` : undefined,
          dx: a >= 0 ? 30 : -30,
          dy: 4,
        });
      }
    });
    segments.push({from: A, to: at(A, d, 1), tone: 2, arrow: true});
    points.push({at: at(A, d, 1), tone: 2, r: 3.5});
  }

  return (
    <div className={shared.wrapper} data-explorer="slope-steps">
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        lines={lines}
        segments={segments}
        points={points}
        caption={caption}
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Diretor <Formula math={`\\vec{d} = ${pairTex(a, b)}`} /> (seta laranja).
        </p>
        <p>
          {zero ? (
            <>
              <strong>Vetor nulo:</strong> a receita não sai de A, e não há reta nenhuma. Por isso o diretor precisa ser
              não nulo.
            </>
          ) : a === 0 ? (
            <>
              <strong>a = 0:</strong> cada passo só anda na vertical. A coordenada x fica parada em {txt(A[0])}, e a reta
              é a vertical <Formula math={`x = ${dec(A[0], 0)}`} />. A divisão <Formula math="\frac{b}{a}" /> não existe:
              a reta vertical não tem inclinação.
            </>
          ) : (
            <>
              A cada {Math.abs(a)} {Math.abs(a) === 1 ? 'casa' : 'casas'} para a {a > 0 ? 'direita' : 'esquerda'},{' '}
              {b === 0
                ? 'a reta fica na mesma altura: ela é horizontal.'
                : `a reta anda ${Math.abs(b)} ${b > 0 ? 'para cima' : 'para baixo'}.`}{' '}
              Inclinação: <Formula math={`m = \\frac{b}{a} = ${slopeTex(a, b)}`} />.
            </>
          )}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>a, quanto cada passo anda na horizontal: {txt(a)}</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={a}
            onChange={(e) => setD([Number(e.target.value), b])}
            aria-label="Coordenada a do diretor"
          />
        </label>
        <label className={shared.control}>
          <span>b, quanto cada passo anda na vertical: {txt(b)}</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={b}
            onChange={(e) => setD([a, Number(e.target.value)])}
            aria-label="Coordenada b do diretor"
          />
        </label>
      </div>
    </div>
  );
}
