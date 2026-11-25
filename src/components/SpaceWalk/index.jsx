import React, {useState} from 'react';
import SpaceScene, {triple} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O endereço de um ponto do espaço (lição 7.34, Vetores no espaço).
//
// Um ponto sai da origem e faz as três etapas do endereço (x, y, z): anda x
// ao longo do eixo x, depois y na direção do eixo y, ainda no chão, e por fim
// sobe (ou desce) z. Os três trechos ficam desenhados: são as arestas da
// "caixa" do ponto. Os botões trocam o ponto, inclusive com zeros (pontos nos
// eixos, no chão e nas paredes) e com a ordem trocada.

const DURATION = 3.6;
const DEFAULT = [
  [3, 4, 2],
  [2, 4, 3],
];

const n = (v) => String(v).replace('-', '−');

function legText(v, axis) {
  if (v === 0) return `não anda na direção ${axis}`;
  if (axis === 'z') return v > 0 ? `sobe ${v}` : `desce ${-v} (abaixo do chão)`;
  return v > 0 ? `anda ${v} na direção ${axis}` : `anda ${-v} no sentido contrário ao do eixo ${axis}`;
}

export function whereIs([x, y, z]) {
  const zeros = [x, y, z].filter((v) => v === 0).length;
  if (zeros === 3) return 'é a origem.';
  if (zeros === 2) return `está no eixo ${x !== 0 ? 'x' : y !== 0 ? 'y' : 'z'}: duas coordenadas são zero.`;
  if (zeros === 1) {
    if (z === 0) return 'está no chão (plano xy): a altura é zero.';
    if (x === 0) return 'está na parede dos eixos y e z: não anda em x.';
    return 'está na parede dos eixos x e z: não anda em y.';
  }
  return z < 0 ? 'fica abaixo do chão, fora dos eixos e das paredes.' : 'fica fora dos eixos, do chão e das paredes.';
}

export default function SpaceWalk({presets = DEFAULT, initial = 0, showWhere = false, caption}) {
  const [index, setIndex] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const [a, b, c] = presets[index];

  const kx = a === 0 ? 1 : stage(t, 0.2, 1.2);
  const ky = b === 0 ? 1 : stage(t, 1.3, 2.3);
  const kz = c === 0 ? 1 : stage(t, 2.4, 3.3);
  const done = stage(t, 3.3, DURATION);
  const walker = [a * kx, b * ky, c * kz];

  const items = [];
  if (a !== 0 && t > 0.2) items.push({type: 'line', from: [0, 0, 0], to: [a * kx, 0, 0], tone: 3, width: 3});
  if (b !== 0 && t > 1.3) items.push({type: 'line', from: [a, 0, 0], to: [a, b * ky, 0], tone: 3, width: 3});
  if (c !== 0 && t > 2.4) items.push({type: 'line', from: [a, b, 0], to: [a, b, c * kz], tone: 3, width: 3});
  if (a !== 0 && kx >= 1) items.push({type: 'label', at: [a / 2, 0, 0], math: n(a), dx: -10, dy: -13, tone: 3});
  if (b !== 0 && ky >= 1) items.push({type: 'label', at: [a, b / 2, 0], math: n(b), dy: 16, tone: 3});
  if (c !== 0 && kz >= 1) items.push({type: 'label', at: [a, b, c * 0.62], math: n(c), dx: 16, tone: 3});
  if (c !== 0 && (a !== 0 || b !== 0)) items.push({type: 'point', at: [a, b, 0], tone: 0, r: 3.5, opacity: done});
  items.push(
    {type: 'point', at: [0, 0, 0], tone: 0, r: 3.5},
    {type: 'point', at: walker, tone: 2, r: 5.5},
    {
      type: 'label',
      at: [a, b, c],
      math: `P${triple([a, b, c])}`,
      dx: 0,
      dy: c < 0 ? 20 : -18,
      tone: 2,
      opacity: done,
    },
  );

  const maxs = [0, 1, 2].map((i) => Math.max(1, ...presets.map((p) => p[i])));
  const minZ = Math.min(0, ...presets.map((p) => p[2]));
  const frame = presets.flatMap((p) => [p, [p[0], p[1], 0]]);

  return (
    <div className={shared.wrapper} data-explorer="space-walk">
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={42}
          axes={{max: [maxs[0] + 0.4, maxs[1] + 0.4, maxs[2] + 0.4], min: [0, 0, minZ < 0 ? minZ - 0.6 : 0]}}
          frame={frame}
          padding={30}
          caption={
            caption ??
            'O ponto laranja sai da origem e segue o endereço: anda na direção x, depois na direção y (ainda no chão) e por fim sobe. Os três trechos verdes são as arestas da caixa do ponto.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`P = ${triple([a, b, c])}`} />: {legText(a, 'x')}, {legText(b, 'y')} e {legText(c, 'z')}.
        </p>
        {showWhere && <p>O ponto {whereIs([a, b, c])}</p>}
      </div>
      <div className={shared.buttons}>
        {presets.map((p, i) => (
          <button
            key={p.join(',')}
            type="button"
            disabled={playing}
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              play();
            }}
          >
            ({p.map(n).join(', ')})
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
