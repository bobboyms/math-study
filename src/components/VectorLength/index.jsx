import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {fmt} from '../mathviz/useAnimation';

// O módulo do vetor (lição 7.28, Vetores): o comprimento da seta.
//
// Dois controles escolhem as coordenadas a e b. A seta sai da origem, e os
// dois trechos tracejados (horizontal e vertical) são os catetos de um
// triângulo retângulo. Os catetos medem |a| e |b|, sem sinal. O painel faz a
// conta de Pitágoras com as coordenadas como elas são, mostrando que o
// quadrado apaga o sinal, e compara a seta com o caminho em "L".

const pair = (a, b) => `(${a},\\ ${b})`;
const sq = (n) => (n < 0 ? `(${n})^2` : `${n}^2`);
const num = (n) => String(n).replace('-', '−');

export default function VectorLength({initialA = -3, initialB = 4, caption}) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  const s = a * a + b * b;
  const root = Math.sqrt(s);
  const exact = Number.isInteger(root);
  const value = exact ? String(root) : `\\approx ${fmt(root, 2).replace(',', '{,}')}`;

  const segments = [];
  const labels = [];
  // Com uma coordenada zero não há triângulo: a seta deita sobre o próprio
  // cateto, e só ela é desenhada.
  const legs = a !== 0 && b !== 0;
  if (legs) {
    segments.push({from: [0, 0], to: [a, 0], tone: 3, dashed: true});
    labels.push({at: [a / 2, 0], math: String(Math.abs(a)), dy: b >= 0 ? 20 : -12, tone: 3});
  }
  if (legs) {
    segments.push({from: [a, 0], to: [a, b], tone: 3, dashed: true});
    labels.push({at: [a, b / 2], math: String(Math.abs(b)), dx: a >= 0 ? 16 : -16, dy: 4, tone: 3});
  }
  if (s > 0) {
    const len = root;
    // Rótulo do módulo do lado de fora do triângulo (lado oposto ao canto).
    const nx = -b / len;
    const ny = a / len;
    // n aponta para o canto (a, 0) quando a e b têm sinais contrários.
    const sign = a * b < 0 ? -1 : 1;
    segments.push({
      from: [0, 0],
      to: [a, b],
      tone: 1,
      arrow: true,
      label: exact ? `${root}` : fmt(root, 2).replace(',', '{,}'),
      dx: sign * nx * 18,
      dy: -sign * ny * 18,
    });
  }
  const points = [{at: [0, 0], tone: 1, r: 4}];
  if (s > 0) {
    labels.push({at: [a, b], math: pair(a, b), dx: a > 0 ? 34 : a < 0 ? -34 : 40, dy: b >= 0 ? -14 : 18, tone: 1});
  }

  let lPath;
  if (s === 0) {
    lPath = <>O vetor nulo não sai do lugar. Não há seta, e o módulo é 0.</>;
  } else if (a === 0 || b === 0) {
    lPath = (
      <>
        Uma das coordenadas é zero. A seta fica deitada sobre um eixo, e o caminho em “L” e a seta têm o mesmo comprimento,{' '}
        <Formula math={String(Math.abs(a) + Math.abs(b))} />.
      </>
    );
  } else {
    lPath = (
      <>
        Caminho em “L”, pelos dois catetos:{' '}
        <Formula math={`${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}`} />. A seta vai em linha reta, pela hipotenusa, e é mais curta.
      </>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="vector-length">
      <CartesianPlane
        xMin={-9}
        xMax={9}
        yMin={-9}
        yMax={9}
        xUnit={20}
        showNumbers={false}
        axisLabels={['x', 'y']}
        segments={segments}
        points={points}
        labels={labels}
        caption={
          caption ??
          'A seta azul sai da origem. Os trechos verdes são os catetos e medem o tamanho de cada coordenada, sem sinal. O número junto da seta é o comprimento dela.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\lVert ${pair(a, b)} \\rVert = \\sqrt{${sq(a)} + ${sq(b)}} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${s}} ${exact ? '= ' : ''}${value}`}
          />
        </p>
        <p>{lPath}</p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Coordenada a: {num(a)}</span>
          <input type="range" min={-8} max={8} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} aria-label="Coordenada a do vetor" />
        </label>
        <label className={shared.control}>
          <span>Coordenada b: {num(b)}</span>
          <input type="range" min={-8} max={8} step={1} value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="Coordenada b do vetor" />
        </label>
      </div>
      <div className={shared.buttons}>
        {[
          [3, 4],
          [-3, 4],
          [6, -8],
          [0, -7],
          [0, 0],
        ].map(([p, q]) => (
          <button
            key={`${p},${q}`}
            type="button"
            aria-pressed={p === a && q === b}
            onClick={() => {
              setA(p);
              setB(q);
            }}
          >
            ({num(p)}, {num(q)})
          </button>
        ))}
      </div>
    </div>
  );
}
