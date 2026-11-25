import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import shared from '../mathviz/explorer.module.css';
import {GENRES, CLIENTS, dot, norm, DEG, decText} from '../GenreBars/clientes';

// Duas colunas de cada vez cabem num desenho (lição 11.2).
//
// O aluno escolhe dois dos cinco gêneros. Cada cliente vira a seta do plano
// com as duas coordenadas desses gêneros. Em todo recorte a seta do Gustavo
// fica sobre a reta da seta da Paula, com o dobro do comprimento, porque o
// Gustavo é o dobro da Paula em todas as coordenadas. Já o ângulo entre Paula
// e Carla muda de um recorte para outro: nenhum recorte mostra o vetor
// inteiro. O painel diz isso com os números do recorte escolhido.
//
// Os deslocamentos dos rótulos foram acertados à mão para cada recorte
// (conferidos nas capturas).

const CUTS = [
  {
    i: 0,
    j: 1,
    off: {Paula: [-14, -16], Gustavo: [10, -16], Carla: [6, -18], Davi: [34, 0]},
  },
  {
    i: 0,
    j: 3,
    off: {Paula: [-14, -16], Gustavo: [-36, -4], Carla: [26, -2], Davi: [0, 0]},
  },
  {
    i: 1,
    j: 2,
    off: {Paula: [-4, -16], Gustavo: [24, -16], Carla: [-14, -16], Davi: [16, -16]},
  },
  {
    i: 3,
    j: 4,
    off: {Paula: [24, 8], Gustavo: [10, -16], Carla: [-6, -18], Davi: [-30, 0]},
  },
  {
    i: 2,
    j: 4,
    off: {Paula: [30, -4], Gustavo: [38, 0], Carla: [12, -16], Davi: [30, 8]},
  },
];

const pairText = (a, b) => `(${a}, ${b})`;
const angle2 = (u, v) => Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (norm(u) * norm(v))))) * DEG;

export default function GenrePlanePicker({initial = 0, caption}) {
  const [idx, setIdx] = useState(initial);
  const cut = CUTS[idx];
  const gi = GENRES[cut.i];
  const gj = GENRES[cut.j];
  const at = (name) => [CLIENTS[name].v[cut.i], CLIENTS[name].v[cut.j]];

  const segments = [];
  const labels = [];
  const points = [];
  // Gustavo primeiro: a seta da Paula fica por cima dela.
  ['Gustavo', 'Davi', 'Carla', 'Paula'].forEach((name) => {
    const p = at(name);
    const c = CLIENTS[name];
    const [dx, dy] = cut.off[name];
    if (p[0] === 0 && p[1] === 0) {
      // O ponto da origem fica entre as setas: o rótulo sobe para a área
      // vazia junto do eixo vertical, ligado ao ponto por um fio.
      points.push({at: [0, 0], tone: c.tone, r: 5});
      segments.push({from: [0.12, 0.3], to: [0.45, 2.9], muted: true});
      labels.push({at: [0.3, 3.4], math: `\\text{${name}} = (0,\\ 0)`, tone: c.tone, anchor: 'start', fontSize: 13});
      return;
    }
    segments.push({from: [0, 0], to: p, tone: c.tone, arrow: true, dashed: name === 'Gustavo'});
    labels.push({at: p, math: `\\text{${name}}`, tone: c.tone, dx, dy, fontSize: 13});
  });

  const P = at('Paula');
  const C = at('Carla');
  const D = at('Davi');
  const angC = angle2(P, C);
  const dNull = D[0] === 0 && D[1] === 0;

  return (
    <div className={shared.wrapper} data-explorer="genre-plane-picker">
      <CartesianPlane
        xMin={-0.8}
        xMax={13.2}
        yMin={-0.8}
        yMax={8.8}
        xUnit={26}
        xLabelEvery={2}
        yLabelEvery={2}
        axisLabels={['', `\\text{${gj}}`]}
        segments={segments}
        points={points}
        labels={[...labels, {at: [13.2, 0], math: `\\text{${gi}}`, anchor: 'end', dy: -14, fontSize: 14}]}
        caption={
          caption ??
          'Cada cliente desenhado só com as duas colunas escolhidas. A seta tracejada é a do Gustavo; a da Paula fica por cima dela.'
        }
      />
      <div className={shared.readout} aria-live="polite">
        <p>
          Recorte {gi} e {gj}: Paula {pairText(...P)}, Gustavo {pairText(...at('Gustavo'))}, Carla {pairText(...C)},
          Davi {pairText(...D)}.
        </p>
        <p>
          A seta do Gustavo está sobre a reta da seta da Paula, com o dobro do comprimento. Isso acontece em todos os
          recortes. Já o ângulo entre Paula e Carla, neste recorte, é de uns {decText(angC, 1)}°, e muda quando você
          troca as colunas.
          {dNull && ' Aqui o Davi vira um ponto na origem, porque ele não viu nenhum filme de ação nem de terror; nas outras colunas ele viu.'}
        </p>
      </div>
      <div className={shared.buttons}>
        {CUTS.map((c, k) => (
          <button key={k} type="button" aria-pressed={k === idx} onClick={() => setIdx(k)}>
            {GENRES[c.i]} e {GENRES[c.j]}
          </button>
        ))}
      </div>
    </div>
  );
}
