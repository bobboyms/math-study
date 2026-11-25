import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {dec, rootTex, sqTex} from '../GenreBars/clientes';

// O módulo como Pitágoras repetido, uma coordenada de cada vez (lição 11.2).
//
// A primeira coordenada é uma perna deitada. Cada coordenada seguinte é uma
// perna nova, em ângulo reto com a hipotenusa anterior; o triângulo retângulo
// formado tem como hipotenusa nova a raiz da soma dos quadrados até ali.
// Cada triângulo fica numa folha plana própria (como na lição 7.34), e a
// figura desenha as folhas lado a lado, uma espiral. Uma coordenada zero não
// acrescenta perna: a hipotenusa não muda.
//
// O botão de comparação põe as pernas em fila, uma depois da outra, contra a
// hipotenusa final: o erro de tomar a soma das coordenadas pelo módulo.

const PRESETS = {
  plano: {label: '(3, 4)', v: [3, 4], name: '\\vec{v}'},
  espaco: {label: '(3, 4, 12)', v: [3, 4, 12], name: '\\vec{v}'},
  paula: {label: 'Paula', v: [6, 1, 0, 4, 3], name: '\\vec{p}'},
  uns: {label: '(1, 1, 1, 1)', v: [1, 1, 1, 1], name: '\\vec{v}'},
  diferenca: {label: 'Paula − Carla', v: [3, -2, -4, 3, 1], name: '\\vec{p} - \\vec{c}'},
};

const W = 440;
const H = 300;
const PAD = 44;
const STEP = 0.85;

function build(v) {
  const tips = [[0, 0]];
  const legs = [];
  let cur = [0, 0];
  v.forEach((x, k) => {
    const len = Math.abs(x);
    const h = Math.hypot(cur[0], cur[1]);
    const dir = h < 1e-9 ? [1, 0] : [-cur[1] / h, cur[0] / h];
    const next = [cur[0] + len * dir[0], cur[1] + len * dir[1]];
    legs.push({k, x, from: cur, to: next, dir, out: h < 1e-9 ? [0, -1] : [cur[0] / h, cur[1] / h]});
    cur = next;
    tips.push(cur);
  });
  return {tips, legs};
}

export default function CoordLengthSpiral({presets = ['plano', 'espaco', 'paula', 'uns'], initial = 'paula', compare = true, caption}) {
  const [key, setKey] = useState(initial);
  const [showLine, setShowLine] = useState(false);
  const pre = PRESETS[key];
  const v = pre.v;
  const n = v.length;
  const duration = 0.3 + n * STEP + 0.5;
  const {ref, t, play, playing} = useAnimation({duration: 0.3 + PRESETS[initial].v.length * STEP + 0.5});
  const {tips, legs} = build(v);

  const xs = tips.map((p) => p[0]);
  const ys = tips.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  const sc = Math.min((W - 2 * PAD) / (x1 - x0 || 1), (H - 2 * PAD) / (y1 - y0 || 1));
  const offX = (W - (x1 - x0) * sc) / 2;
  const offY = (H - (y1 - y0) * sc) / 2;
  const S = (p) => [offX + (p[0] - x0) * sc, H - offY - (p[1] - y0) * sc];

  const legK = (k) => stage(t, 0.3 + k * STEP, 0.3 + k * STEP + STEP * 0.6);
  const hypK = (k) => stage(t, 0.3 + k * STEP + STEP * 0.6, 0.3 + (k + 1) * STEP);
  const partial = (k) => v.slice(0, k + 1).reduce((s, x) => s + x * x, 0);
  // Última perna já desenhada (para saber qual hipotenusa é a atual).
  let current = -1;
  legs.forEach((leg) => {
    if (leg.x !== 0 && legK(leg.k) > 0.01) current = leg.k;
  });
  const finished = t >= duration - 0.05;
  const total = partial(n - 1);
  const totalLen = Math.sqrt(total);
  const lineSum = v.reduce((s, x) => s + Math.abs(x), 0);

  const els = [];
  legs.forEach((leg) => {
    if (leg.x === 0) return;
    const k = legK(leg.k);
    if (k <= 0) return;
    const a = S(leg.from);
    const b = S([leg.from[0] + (leg.to[0] - leg.from[0]) * k, leg.from[1] + (leg.to[1] - leg.from[1]) * k]);
    els.push(<line key={`leg${leg.k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--mv-tone-2)" strokeWidth={2.5} strokeLinecap="round" />);
    // marca de ângulo reto entre a hipotenusa anterior e a perna nova
    if (leg.k > 0 && Math.hypot(leg.from[0], leg.from[1]) > 1e-9 && k > 0.5) {
      const m = 8;
      const back = [-leg.out[0], leg.out[1]];
      const nd = [leg.dir[0], -leg.dir[1]];
      const p1 = [a[0] + back[0] * m, a[1] + back[1] * m];
      const p2 = [p1[0] + nd[0] * m, p1[1] + nd[1] * m];
      const p3 = [a[0] + nd[0] * m, a[1] + nd[1] * m];
      els.push(<path key={`ra${leg.k}`} d={`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}`} fill="none" stroke="var(--mv-guide)" strokeWidth={1.2} />);
    }
    if (k > 0.9) {
      const mid = S([(leg.from[0] + leg.to[0]) / 2, (leg.from[1] + leg.to[1]) / 2]);
      const o = [leg.out[0], -leg.out[1]];
      els.push(
        <SvgMath key={`lab${leg.k}`} x={mid[0] + o[0] * 16} y={mid[1] + o[1] * 16} math={dec(leg.x, 2)} fontSize={13} tone={2} halo />,
      );
    }
  });

  // hipotenusas: as antigas tracejadas, a atual cheia
  const hyps = [];
  legs.forEach((leg) => {
    if (leg.k === 0 || leg.x === 0) return;
    const k = hypK(leg.k);
    if (k <= 0) return;
    const isLast = leg.k === n - 1 || legs.slice(leg.k + 1).every((l) => l.x === 0);
    const a = S([0, 0]);
    const b = S(leg.to);
    const active = leg.k === current || (finished && isLast);
    hyps.push(
      <line
        key={`h${leg.k}`}
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={active ? 'var(--mv-tone-1)' : 'var(--mv-guide)'}
        strokeWidth={active ? 2.5 : 1.3}
        strokeDasharray={active ? undefined : '5 4'}
        opacity={k}
      />,
    );
    if (active && k > 0.9) {
      const p = partial(leg.k);
      const mid = S([leg.to[0] / 2, leg.to[1] / 2]);
      const h = Math.hypot(leg.to[0], leg.to[1]);
      const perp = [-leg.to[1] / h, -leg.to[0] / h];
      const math = finished && isLast
        ? `\\lVert ${pre.name} \\rVert = ${rootTex(p)}${Number.isInteger(Math.sqrt(p)) ? '' : ` \\approx ${dec(Math.sqrt(p), 2)}`}`
        : `${rootTex(p)}`;
      const anchor = perp[0] < -0.3 ? 'end' : perp[0] > 0.3 ? 'start' : 'middle';
      hyps.push(<SvgMath key={`hl${leg.k}`} x={mid[0] + perp[0] * 12} y={mid[1] + perp[1] * 14} math={math} fontSize={14} tone={1} anchor={anchor} halo />);
    }
  });

  const o = S([0, 0]);
  const tipEnd = S(tips[tips.length - 1]);
  const lineY = H + 28;
  const lineSc = (W - 2 * PAD) / Math.max(lineSum, totalLen);
  const H2 = compare && showLine ? H + 74 : H;

  return (
    <div className={shared.wrapper} data-explorer="coord-length-spiral">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H2}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Espiral de triângulos retângulos: cada coordenada é uma perna nova, em ângulo reto com a hipotenusa anterior.">
          {hyps}
          {els}
          <circle cx={o[0]} cy={o[1]} r={3.5} fill="var(--ifm-font-color-base)" />
          {finished && <circle cx={tipEnd[0]} cy={tipEnd[1]} r={3.5} fill="var(--mv-tone-1)" />}
          {compare && showLine && (
            <g>
              {(() => {
                let x = PAD;
                return v.map((c, i) => {
                  const w = Math.abs(c) * lineSc;
                  const seg = (
                    <g key={i}>
                      <line x1={x} x2={x + w} y1={lineY} y2={lineY} stroke="var(--mv-tone-2)" strokeWidth={3} />
                      <line x1={x} x2={x} y1={lineY - 5} y2={lineY + 5} stroke="var(--mv-tone-2)" strokeWidth={1.5} />
                    </g>
                  );
                  x += w;
                  return seg;
                });
              })()}
              <SvgMath x={PAD} y={lineY - 15} math={`\\text{pernas em fila: } ${dec(lineSum, 2)}`} anchor="start" fontSize={13} tone={2} />
              <line x1={PAD} x2={PAD + totalLen * lineSc} y1={lineY + 30} y2={lineY + 30} stroke="var(--mv-tone-1)" strokeWidth={3} />
              <SvgMath
                x={PAD + totalLen * lineSc + 8}
                y={lineY + 30}
                math={`\\text{módulo: } ${dec(totalLen, 2)}`}
                anchor="start"
                fontSize={13}
                tone={1}
                space={W - PAD - totalLen * lineSc - 8}
              />
            </g>
          )}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`\\lVert ${pre.name} \\rVert^2 = ${v.map(sqTex).join(' + ')} = ${v.map((x) => x * x).join(' + ')} = ${total}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\lVert ${pre.name} \\rVert = ${rootTex(total)}${Number.isInteger(totalLen) ? '' : ` \\approx ${dec(totalLen, 2)}`}`}
          />
        </p>
        {v.includes(0) && <p>A coordenada zero não acrescenta perna: a hipotenusa fica do mesmo tamanho.</p>}
        {compare && showLine && (
          <p>
            As pernas em fila somam {String(dec(lineSum, 2)).replace('{,}', ',')}, mas o caminho em linha reta, da origem até
            a última ponta, mede só {String(dec(totalLen, 2)).replace('{,}', ',')}. Somar as coordenadas não dá o módulo.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play({duration})} disabled={playing}>
          Ver de novo
        </button>
        {compare && (
          <button type="button" aria-pressed={showLine} disabled={playing} onClick={() => setShowLine(!showLine)}>
            {showLine ? 'Esconder as pernas em fila' : 'Comparar com as pernas em fila'}
          </button>
        )}
      </div>
      {presets.length > 1 && (
        <div className={shared.buttons}>
          {presets.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={k === key}
              disabled={playing}
              onClick={() => {
                setKey(k);
                play({duration: 0.3 + PRESETS[k].v.length * STEP + 0.5});
              }}
            >
              {PRESETS[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
