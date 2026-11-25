import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {at, dec, pairTex, round} from '../mathviz/lineParam';

// Uma reta, muitas receitas (lição 7.33, Retas com vetores).
//
// A receita original A + t·d (azul) e uma segunda receita B + t·e (laranja),
// escolhida nos botões, andam com o mesmo t. Os pontos inteiros de cada uma
// ficam marcados. Quando as duas receitas descrevem a mesma reta, os pontos
// laranja caem todos sobre a linha azul, em outra ordem ou com outro
// espaçamento. No contraexemplo, a linha laranja sai da azul.

const txt = (v) => dec(v, 1).replace('{,}', ',').replace('-', '−');

const RECIPES = [
  {key: 'clock', name: 'Outro relógio', B: [5, 4], e: [2, 1]},
  {key: 'step', name: 'Outro passo', B: [1, 2], e: [-4, -2]},
  {key: 'both', name: 'Os dois trocados', B: [5, 4], e: [-4, -2]},
  {key: 'wrong', name: 'Contraexemplo', B: [1, 2], e: [1, 2]},
];

// e é múltiplo de d? Devolve o número k com e = k·d, ou null.
function multiple(e, d) {
  const k = d[0] !== 0 ? e[0] / d[0] : e[1] / d[1];
  return Math.abs(e[0] - k * d[0]) < 1e-9 && Math.abs(e[1] - k * d[1]) < 1e-9 ? round(k) : null;
}

export default function SameLineRecipes({
  A = [1, 2],
  d = [2, 1],
  xMin = -4,
  xMax = 10,
  yMin = -2,
  yMax = 8,
  xUnit = 30,
  initialRecipe = 'clock',
  caption,
}) {
  const [key, setKey] = useState(initialRecipe);
  const [t, setT] = useState(1);
  const r = RECIPES.find((item) => item.key === key);
  const {B, e} = r;

  const P = at(A, d, t);
  const Q = at(B, e, t);
  const k = multiple(e, d);
  // B está na reta original? Procura s com B = A + s·d.
  const s = d[0] !== 0 ? (B[0] - A[0]) / d[0] : (B[1] - A[1]) / d[1];
  const bOn = Math.abs(A[0] + s * d[0] - B[0]) < 1e-9 && Math.abs(A[1] + s * d[1] - B[1]) < 1e-9;
  const same = k !== null && bOn;

  const inside = (p) => p[0] >= xMin && p[0] <= xMax && p[1] >= yMin && p[1] <= yMax;
  const points = [];
  [-2, -1, 0, 1, 2, 3].forEach((m) => {
    const p = at(A, d, m);
    if (inside(p)) points.push({at: p, tone: 1, r: 3});
  });
  [-2, -1, 0, 1, 2, 3].forEach((m) => {
    const q = at(B, e, m);
    if (inside(q)) points.push({at: q, tone: 2, r: 3.5, open: true});
  });
  const sameStart = A[0] === B[0] && A[1] === B[1];
  if (sameStart) {
    points.push({at: A, tone: 1, r: 4.5, label: 'A = B', dx: 0, dy: 20});
  } else {
    points.push({at: A, tone: 1, r: 4.5, label: 'A', dx: -14, dy: 16});
    points.push({at: B, tone: 2, r: 4.5, label: 'B', dx: 14, dy: 16});
  }
  points.push({at: P, tone: 1, r: 6, label: 'P', dx: -12, dy: -14});
  points.push({at: Q, tone: 2, r: 6, label: 'Q', dx: 14, dy: -12});

  const segments = [
    {from: A, to: at(A, d, 1), tone: 1, arrow: true, label: '\\vec{d}', dx: -6, dy: -16},
    {from: B, to: at(B, e, 1), tone: 2, arrow: true, label: '\\vec{e}', dx: 14, dy: 14},
  ];

  return (
    <div className={shared.wrapper} data-explorer="same-line-recipes">
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        lines={[
          {through: [A, at(A, d, 1)], tone: 1},
          {through: [B, at(B, e, 1)], tone: 2, dashed: true},
        ]}
        segments={segments}
        points={points}
        caption={caption}
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          Azul: <Formula math={`P = ${pairTex(A[0], A[1])} + t${pairTex(d[0], d[1])}`} />. Laranja:{' '}
          <Formula math={`Q = ${pairTex(B[0], B[1])} + t${pairTex(e[0], e[1])}`} />.
        </p>
        <p className={shared.formula}>
          Com <Formula math={`t = ${dec(t, 1)}`} />: <Formula math={`P = ${pairTex(P[0], P[1])}`} /> e{' '}
          <Formula math={`Q = ${pairTex(Q[0], Q[1])}`} />.
        </p>
        <p>
          Teste 1, os diretores:{' '}
          {k !== null ? (
            <>
              <Formula math={`${pairTex(e[0], e[1])} = ${dec(k, 1)} \\times ${pairTex(d[0], d[1])}`} />, paralelos.
            </>
          ) : (
            <>
              <Formula math={pairTex(e[0], e[1])} /> não é múltiplo de <Formula math={pairTex(d[0], d[1])} />, não são
              paralelos.
            </>
          )}{' '}
          Teste 2, a partida:{' '}
          {bOn ? (
            <>
              B está na reta azul, no passo <Formula math={`t = ${dec(s, 1)}`} />.
            </>
          ) : (
            'B não está na reta azul.'
          )}
        </p>
        <p>
          <strong>{same ? 'As duas receitas descrevem a mesma reta.' : 'As receitas descrevem retas diferentes.'}</strong>{' '}
          {same
            ? 'P e Q andam pelos mesmos lugares, mas em geral não estão no mesmo lugar no mesmo t: o que muda é o relógio ou o passo.'
            : 'A linha laranja sai da azul: só o ponto de partida é comum.'}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Número de passos, o mesmo nas duas: t = {txt(t)}</span>
          <input
            type="range"
            min={-1}
            max={2}
            step={0.5}
            value={t}
            onChange={(ev) => setT(Number(ev.target.value))}
            aria-label="Número de passos t"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {RECIPES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setKey(item.key)}
            aria-pressed={item.key === key}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
