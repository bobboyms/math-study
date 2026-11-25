import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {PI, piLabel, num} from '../TrigEqCycleLine/angles';

// Busca das soluções que caem num intervalo.
//
// A solução geral é uma ou mais famílias, como π/6 + 2kπ e 5π/6 + 2kπ. O
// aluno escolhe um k numa família; o valor vai para a reta numérica e para o
// registro, marcado como dentro ou fora do intervalo pedido. O painel conta
// quantas das soluções do intervalo já foram achadas.
//
//   <TrigEqInterval
//     families={[
//       {tex: '\\frac{\\pi}{6} + 2k\\pi', base: Math.PI / 6, step: 2 * Math.PI},
//       {tex: '\\frac{5\\pi}{6} + 2k\\pi', base: 5 * Math.PI / 6, step: 2 * Math.PI},
//     ]}
//     interval={[0, 4 * Math.PI]} intervalTex="[0,\ 4\pi]"
//     ks={[-1, 0, 1, 2, 3]} initialTries={[[0, 0]]}
//   />

const W = 600;
const H = 120;
const LEFT = 26;
const RIGHT = 26;
const AXIS_Y = 74;
const TONES = [1, 3, 2];

const xTex = (x) => {
  const p = piLabel(x);
  return p ?? num(x, 2);
};

export default function TrigEqInterval({families, interval, intervalTex, ks = [-2, -1, 0, 1, 2, 3], initialTries = [], caption}) {
  const [tries, setTries] = useState(initialTries);
  const [a, b] = interval;
  // Janela da reta: o intervalo e mais um pedaço de cada lado, para que os
  // valores de fora apareçam fora.
  const all = [];
  families.forEach((fam) => ks.forEach((k) => all.push(fam.base + k * fam.step)));
  const lo = Math.min(a - 0.15 * (b - a), ...all.filter((x) => x > a - 0.6 * (b - a)));
  const hi = Math.max(b + 0.15 * (b - a), ...all.filter((x) => x < b + 0.6 * (b - a)));
  const sx = (x) => LEFT + ((x - lo) / (hi - lo)) * (W - LEFT - RIGHT);
  const inside = (x) => x >= a - 1e-9 && x <= b + 1e-9;

  // Quantas soluções o intervalo tem, contando cada valor uma vez.
  const target = [];
  families.forEach((fam) => {
    for (let k = -50; k <= 50; k += 1) {
      const x = fam.base + k * fam.step;
      if (inside(x) && !target.some((y) => Math.abs(y - x) < 1e-7)) target.push(x);
    }
  });
  target.sort((p, q) => p - q);

  const tried = tries.map(([fi, k]) => ({fi, k, x: families[fi].base + k * families[fi].step}));
  const found = target.filter((x) => tried.some((tr) => Math.abs(tr.x - x) < 1e-7));
  const has = (fi, k) => tries.some(([f, kk]) => f === fi && kk === k);
  const toggle = (fi, k) => setTries((old) => (has(fi, k) ? old.filter(([f, kk]) => !(f === fi && kk === k)) : [...old, [fi, k]]));

  // Marcas da reta: múltiplos de π dentro da janela.
  const ticks = [];
  for (let n = Math.ceil(lo / PI); n <= Math.floor(hi / PI); n += 1) ticks.push(n * PI);

  // Rótulos dos valores tentados: alternam acima e abaixo quando ficam perto.
  const sorted = [...tried].sort((p, q) => p.x - q.x);
  let lastUp = -Infinity;
  const labelRow = new Map();
  sorted.forEach((tr) => {
    const px = sx(tr.x);
    const up = px - lastUp > 44;
    labelRow.set(`${tr.fi},${tr.k}`, up ? 0 : 1);
    if (up) lastUp = px;
  });

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-interval">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Reta numérica com o intervalo ${intervalTex} e os valores tentados.`}>
          <line x1={sx(lo)} y1={AXIS_Y} x2={sx(hi) + 8} y2={AXIS_Y} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={`M ${sx(hi) + 8} ${AXIS_Y} l -7 -4 v 8 z`} fill="var(--ifm-color-emphasis-700)" />
          {/* o intervalo pedido, com as pontas fechadas */}
          <line x1={sx(a)} y1={AXIS_Y} x2={sx(b)} y2={AXIS_Y} stroke="var(--mv-guide)" strokeWidth={9} strokeLinecap="butt" opacity={0.55} />
          <circle cx={sx(a)} cy={AXIS_Y} r={5} fill="var(--ifm-color-emphasis-700)" />
          <circle cx={sx(b)} cy={AXIS_Y} r={5} fill="var(--ifm-color-emphasis-700)" />
          {ticks.map((x) => (
            <g key={x}>
              <line x1={sx(x)} y1={AXIS_Y - 5} x2={sx(x)} y2={AXIS_Y + 5} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={sx(x)} y={AXIS_Y + 20} math={piLabel(x)} fontSize={12} halo space={50} />
            </g>
          ))}
          {tried.map((tr) => {
            const tone = TONES[tr.fi];
            const row = labelRow.get(`${tr.fi},${tr.k}`);
            const ok = inside(tr.x);
            return (
              <g key={`${tr.fi},${tr.k}`}>
                <line x1={sx(tr.x)} y1={AXIS_Y} x2={sx(tr.x)} y2={AXIS_Y - 20 - 22 * row} stroke={`var(--mv-tone-${tone})`} strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={sx(tr.x)} cy={AXIS_Y} r={6} fill={ok ? `var(--mv-tone-${tone})` : 'var(--mv-paper)'} stroke={`var(--mv-tone-${tone})`} strokeWidth={2} />
                <SvgMath x={sx(tr.x)} y={AXIS_Y - 30 - 22 * row} math={xTex(tr.x)} fontSize={13} tone={tone} halo space={70} />
              </g>
            );
          })}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'A faixa cinza é o intervalo pedido, com as duas pontas incluídas. Ponto cheio caiu dentro; ponto vazio caiu fora.'}
        </figcaption>
      </figure>

      <div className={shared.buttons} style={{display: 'grid', gap: '0.5rem'}}>
        {families.map((fam, fi) => (
          <div key={fi} style={{display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center'}}>
            <span style={{color: `var(--mv-tone-${TONES[fi]})`, minWidth: '8.5rem'}}>
              <Formula math={`x = ${fam.tex}`} />
            </span>
            {ks.map((k) => (
              <button key={k} type="button" onClick={() => toggle(fi, k)} aria-pressed={has(fi, k)}>
                k = {k < 0 ? `−${-k}` : k}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className={shared.readout} aria-live="polite">
        {tried.length === 0 ? (
          <p>Escolha um valor de k numa das famílias para ver onde ele cai.</p>
        ) : (
          <ul style={{margin: 0}}>
            {tried.map((tr) => (
              <li key={`${tr.fi},${tr.k}`}>
                <Formula math={`k = ${tr.k}`} />: <Formula math={`x = ${xTex(tr.x)}${piLabel(tr.x) ? ` \\approx ${num(tr.x, 2)}` : ''}`} />,{' '}
                {inside(tr.x) ? <strong>dentro</strong> : 'fora'} de <Formula math={intervalTex} />.
              </li>
            ))}
          </ul>
        )}
        <p>
          {found.length === target.length && tried.length > 0 ? (
            <strong>As {target.length} soluções do intervalo foram achadas. Qualquer outro k cai fora.</strong>
          ) : (
            <>Você já achou <strong>{found.length}</strong> das {target.length} soluções que estão em <Formula math={intervalTex} />.</>
          )}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => setTries([])}>Limpar as tentativas</button>
      </div>
    </div>
  );
}
