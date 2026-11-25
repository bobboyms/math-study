import React, {useState} from 'react';
import SpaceScene, {add, triple, tex} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O cubo de aresta 1 virando a caixa das colunas (lição 11.9).
//
// Uma matriz 3 × 3 leva e1, e2 e e3 nas suas três colunas, e o cubo de aresta
// 1 numa caixa inclinada (paralelepípedo) com essas arestas. A animação leva o
// cubo até a caixa em linha reta, (1 − s)I + sM. As duas primeiras colunas
// ficam em azul, a terceira em laranja, e a caixa em verde (chão mais forte,
// teto mais claro). O painel dá o determinante do instante, e o volume é o
// valor dele sem o sinal.
//
// Com `floor` no botão, o chão (paralelogramo das duas primeiras colunas) fica
// destacado e uma linha tracejada mostra a altura da terceira coluna: é a
// leitura “área do chão vezes altura” da matriz triangular.
//
// O deslizante gira a cena em torno do eixo z, para enxergar a profundidade.

const E = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const det3 = ([c1, c2, c3]) =>
  c1[0] * (c2[1] * c3[2] - c3[1] * c2[2]) - c2[0] * (c1[1] * c3[2] - c3[1] * c1[2]) + c3[0] * (c1[1] * c2[2] - c2[1] * c1[2]);

const corners = ([c1, c2, c3]) => {
  const out = [];
  for (let i = 0; i < 2; i += 1)
    for (let j = 0; j < 2; j += 1)
      for (let k = 0; k < 2; k += 1) out.push([0, 1, 2].map((q) => i * c1[q] + j * c2[q] + k * c3[q]));
  return out;
};

export default function DetBox3D({presets, initial = 0, unit = 30, axesMax = [3, 5, 5], caption}) {
  const [idx, setIdx] = useState(initial);
  const [view, setView] = useState(0);
  const {ref, t, play, playing} = useAnimation({duration: 3.4});
  const p = presets[idx];
  const s = stage(t, 0.3, 2.9);
  const cols = p.cols.map((c, i) => c.map((v, q) => (1 - s) * E[i][q] + s * v));
  const [c1, c2, c3] = cols;
  const d = det3(cols);
  const atRest = !playing;
  const floorOn = !!p.floor;

  const c12 = add(c1, c2);
  const items = [];
  // chão e teto
  items.push({type: 'poly', pts: [[0, 0, 0], c1, c12, c2], tone: 3, fill: floorOn ? 0.34 : 0.2, stroke: true});
  items.push({type: 'poly', pts: [c3, add(c3, c1), add(c3, c12), add(c3, c2)], tone: 3, fill: 0.1, stroke: true});
  // arestas laterais
  [[0, 0, 0], c1, c12, c2].forEach((q) => items.push({type: 'line', from: q, to: add(q, c3), tone: 3, width: 1.4}));
  if (floorOn) {
    items.push({type: 'line', from: c3, to: [c3[0], c3[1], 0], guide: true});
    items.push({type: 'point', at: [c3[0], c3[1], 0], tone: 2, r: 3.5});
  }
  items.push({type: 'arrow', to: c1, tone: 1, math: atRest ? triple(c1) : null, ...(p.offsets?.[0] ?? {dx: 10, dy: 18, anchor: 'start'})});
  items.push({type: 'arrow', to: c2, tone: 1, math: atRest ? triple(c2) : null, ...(p.offsets?.[1] ?? {dx: 10, dy: 12, anchor: 'start'})});
  items.push({type: 'arrow', to: c3, tone: 2, math: atRest ? triple(c3) : null, ...(p.offsets?.[2] ?? {dx: -10, dy: -10, anchor: 'end'})});
  if (floorOn && atRest && p.heightLabel) {
    items.push({type: 'label', at: [c3[0], c3[1], c3[2] / 2], math: p.heightLabel, dx: 8, anchor: 'start', tone: 2});
  }

  const frame = presets.flatMap((q) => corners(q.cols)).concat(corners(E));
  const rows = [0, 1, 2].map((r) => cols.map((c) => tex(c[r], 2)).join(' & ')).join(' \\\\ ');
  const vol = Math.abs(d);
  const flat = vol < 1e-9;

  return (
    <div className={shared.wrapper} data-explorer="det-box-3d">
      <div ref={ref}>
        <SpaceScene
          items={items}
          view={view}
          unit={unit}
          frame={frame}
          frameViews={[-40, 0, 40]}
          axes={{max: axesMax}}
          caption={p.caption ?? caption}
          ariaLabel="O cubo de aresta 1 se transformando na caixa inclinada das três colunas"
        />
      </div>
      <div className={shared.buttons} role="group" aria-label="Escolher a matriz">
        {presets.map((q, i) => (
          <button
            key={q.label}
            type="button"
            aria-pressed={i === idx}
            style={i === idx ? {borderColor: 'var(--ifm-color-primary)', fontWeight: 600} : undefined}
            disabled={playing}
            onClick={() => {
              setIdx(i);
              play();
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
      <div className={shared.controls} style={{marginTop: '0.8rem'}}>
        <label className={shared.control}>
          <span>
            Girar a cena em torno do eixo z: <strong>{view}°</strong>
          </span>
          <input type="range" min={-40} max={40} step={5} value={view} onChange={(e) => setView(Number(e.target.value))} aria-label="Girar a cena em torno do eixo z" />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`\\det \\begin{bmatrix} ${rows} \\end{bmatrix} = ${tex(d, 2)}`} />
        </p>
        <p>
          {flat
            ? 'Volume da caixa: 0. As três colunas estão num mesmo plano, e a caixa achatou numa folha.'
            : `Volume da caixa: ${tex(vol, 2).replace('{,}', ',')}, o determinante sem o sinal. O cubo de aresta 1 tinha volume 1.`}
        </p>
        {atRest && p.note && <p className={shared.hint}>{p.note}</p>}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o cubo virar caixa de novo
        </button>
      </div>
    </div>
  );
}
