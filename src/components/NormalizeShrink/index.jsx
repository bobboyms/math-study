import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {dec, pairTex} from '../mathviz/vectorArc';

// Normalizar é encolher a seta até a ponta tocar o ciclo (lição 7.30).
//
// O vetor v (azul, contorno tracejado depois que a cópia começa a encolher)
// e o ciclo de raio 1. Uma cópia de v (verde) encolhe sobre a mesma reta, sem
// girar, até medir 1: as duas coordenadas são divididas pelo módulo. Num
// vetor mais curto que 1, como (0,4; −0,3), a cópia estica em vez de encolher.
// O botão do erro mostra (laranja) o que sai ao dividir pela soma das
// coordenadas: a seta aponta para o lado certo, mas a ponta não cai no ciclo.

const DURATION = 3;
const PRESETS = [
  [4, 3],
  [1, 1],
  [-3, 4],
  [0.4, -0.3],
  [0, 0],
];

const txt = (n) => String(n).replace('.', ',').replace('-', '−');
const label = (p, q) => {
  const sep = Number.isInteger(p) && Number.isInteger(q) ? ',' : ';';
  return `(${txt(p)}${sep} ${txt(q)})`;
};
const exact3 = (x) => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-9;
const sq = (n) => (n < 0 ? `(${dec(n, 1)})^2` : `${dec(n, 1)}^2`);

export default function NormalizeShrink({initial = [4, 3], caption}) {
  const [v, setV] = useState(initial);
  const [wrong, setWrong] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k = stage(t, 0.5, DURATION - 0.2);

  const [a, b] = v;
  const len = Math.hypot(a, b);
  const zero = len === 0;
  const factor = zero ? 1 : 1 + (1 / len - 1) * k;
  const copy = [a * factor, b * factor];
  const sum = a + b;
  const wrongOk = sum > 0;
  const w = wrongOk ? [a / sum, b / sum] : null;

  const segments = [];
  const labels = [];
  if (!zero) {
    segments.push({from: [0, 0], to: v, tone: 1, arrow: true, dashed: k > 0.02});
    if (k > 0.02) segments.push({from: [0, 0], to: copy, tone: 3, arrow: true});
    labels.push({at: v, math: '\\vec{v}', dx: a >= 0 ? 14 : -14, dy: b >= 0 ? -14 : 16, tone: 1});
    if (k > 0.98) {
      const u = [a / len, b / len];
      labels.push({at: u, math: pairTex(u[0], u[1], 2), dx: u[0] >= 0 ? 72 : -72, dy: u[1] >= 0 ? 40 : -40, tone: 3});
    }
    if (wrong && w && !playing) {
      segments.push({from: [0, 0], to: w, tone: 2, arrow: true});
      // Com soma 1, a seta errada é o próprio v: o rótulo dela cairia em
      // cima do rótulo de v, e o painel já explica o caso.
      if (Math.abs(sum - 1) > 1e-9) labels.push({at: w, math: pairTex(w[0], w[1], 2), dx: 62, dy: -4, tone: 2});
    }
  }

  const pick = (p) => {
    setV(p);
    setWrong(false);
    play();
  };

  return (
    <div className={shared.wrapper} data-explorer="normalize-shrink">
      <div ref={ref}>
        <CartesianPlane
          xMin={-4.6}
          xMax={4.6}
          yMin={-1.6}
          yMax={4.6}
          xUnit={36}
          showNumbers={false}
          axisLabels={['x', 'y']}
          circles={[{center: [0, 0], r: 1, tone: 3, dashed: true}]}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'O vetor v (azul) e o ciclo de raio 1 (verde tracejado). A cópia verde de v encolhe sobre a mesma reta, sem girar, até a ponta tocar o ciclo: é o vetor normalizado. Se v for mais curto que 1, a cópia estica.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {zero ? (
          <p>
            O vetor nulo tem módulo 0. Dividir por 0 não está definido, e não há seta para encolher: não existe o
            vetor unitário que aponta para o mesmo lado dele.
          </p>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\lVert \\vec{v} \\rVert = \\sqrt{${sq(a)} + ${sq(b)}} ${Number.isInteger(len) ? '=' : '\\approx'} ${dec(len, 3)}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula
                math={`\\frac{\\vec{v}}{\\lVert \\vec{v} \\rVert} = \\left(\\frac{${dec(a, 1)}}{${dec(len, 3)}};\\ \\frac{${dec(b, 1)}}{${dec(len, 3)}}\\right) ${
                  exact3(a / len) && exact3(b / len) ? '=' : '\\approx'
                } ${pairTex(a / len, b / len, 3)}`}
              />
            </p>
            {wrong && w && (
              <p>
                Dividindo pela soma das coordenadas, <Formula math={`${dec(a, 1)} + ${dec(b, 1)} = ${dec(sum, 1)}`} />, sai{' '}
                <Formula math={pairTex(w[0], w[1], 3)} />, de módulo{' '}
                <Formula math={`\\approx ${dec(Math.hypot(w[0], w[1]), 3)}`} />. {Math.abs(sum - 1) < 1e-9 ? ' Como a soma dá 1, a seta laranja é o próprio v, por cima da azul.' : ''} A seta laranja aponta para o lado certo, mas a ponta
                {Math.hypot(w[0], w[1]) < 1 ? ' para antes do' : ' passa do'} ciclo: não é unitária.
              </p>
            )}
            {wrong && !w && (
              <p>
                Aqui a soma das coordenadas é <Formula math={`${dec(sum, 1)}`} />. Dividir por ela{' '}
                {sum === 0 ? 'nem é possível' : 'inverteria o sentido da seta'}. Mais uma razão para dividir pelo módulo.
              </p>
            )}
          </>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing || zero}>
          Ver a seta encolher de novo
        </button>
        <button type="button" onClick={() => setWrong(!wrong)} disabled={playing || zero} aria-pressed={wrong}>
          {wrong ? 'Esconder o erro' : 'Mostrar o erro: dividir pela soma'}
        </button>
      </div>
      <div className={shared.buttons}>
        {PRESETS.map((p) => (
          <button key={label(...p)} type="button" aria-pressed={p[0] === a && p[1] === b} disabled={playing} onClick={() => pick(p)}>
            {label(...p)}
          </button>
        ))}
      </div>
    </div>
  );
}
