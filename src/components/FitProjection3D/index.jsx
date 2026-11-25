import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {tnum, pnum} from '../FitLineExplorer/apartamentos';

// A melhor previsão é a projeção de b sobre o plano das colunas (lição 11.12).
//
// Três pontos, (0, 2), (1, 1) e (2, 3), para caber no desenho: cada eixo do
// espaço é um ponto dos dados. As colunas de A são a = (0, 1, 2) (os x) e
// 1 = (1, 1, 1). Toda lista de previsões A c = m a + n 1 é um ponto do plano
// laranja, que passa pela origem. O vetor dos valores observados,
// b = (2, 1, 3), fica fora do plano (do lado de quem olha, na vista inicial). O deslizante move A c pelo plano; o
// segmento verde vai de A c até b, e o quadrado do tamanho dele é a soma dos
// quadrados dos erros. O mais perto é o pé da perpendicular, A c = (1,5; 2;
// 2,5), com m = 0,5 e n = 1,5, resto (0,5; −1; 0,5) e soma 1,5.
//
// A cena é desenhada em projeção ortogonal (sem a perspectiva oblíqua do
// SpaceScene), para que, na vista de perfil, o plano vire uma reta e o ângulo
// reto entre o resto e o plano apareça reto de verdade na tela. A vista de
// perfil é o giro φ em que a direção do olhar fica dentro do plano.
//
// Com `pythagoras`, o pé H fica marcado e o painel escreve a soma dos
// quadrados de qualquer A c como 1,5 mais o quadrado da distância de A c até
// H (triângulo retângulo b, H, A c).

const A = [0, 1, 2];
const ONE = [1, 1, 1];
const B = [2, 1, 3];
const FOOT_C = [0.5, 1.5];
const EPS = (25 * Math.PI) / 180;
const PHI0 = 15;
const PHI_EDGE = ((Math.atan2(1, 2) + Math.asin(Math.tan(EPS) / Math.sqrt(5))) * 180) / Math.PI; // ≈ 38,6°
const M_RANGE = [-0.5, 1.5];
const N_RANGE = [0, 2.5];
const UNIT = 64;

const add = (p, q) => p.map((v, i) => v + q[i]);
const sub = (p, q) => p.map((v, i) => v - q[i]);
const times = (k, p) => p.map((v) => k * v);
const dot = (p, q) => p.reduce((s, v, i) => s + v * q[i], 0);
const comb = (m, n) => add(times(m, A), times(n, ONE));
const FOOT = comb(...FOOT_C);

function camera(phiDeg) {
  const f = (phiDeg * Math.PI) / 180;
  const right = [-Math.sin(f), Math.cos(f), 0];
  const up = [-Math.sin(EPS) * Math.cos(f), -Math.sin(EPS) * Math.sin(f), Math.cos(EPS)];
  return (p) => [dot(p, right), -dot(p, up)];
}

const AXES = [
  [3.3, 0, 0],
  [0, 4.6, 0],
  [0, 0, 6],
];
const PATCH = [
  comb(M_RANGE[0], N_RANGE[0]),
  comb(M_RANGE[1], N_RANGE[0]),
  comb(M_RANGE[1], N_RANGE[1]),
  comb(M_RANGE[0], N_RANGE[1]),
];

// Caixa fixa: todas as vistas do deslizante cabem nela, e a figura não muda de
// tamanho quando a cena gira.
const FRAME = (() => {
  const pts = [[0, 0, 0], ...AXES, ...PATCH, B];
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let phi = -80; phi <= 60; phi += 2) {
    const P = camera(phi);
    pts.forEach((p) => {
      const [x, y] = P(p);
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    });
  }
  const pad = 40;
  return {left: x0 * UNIT - pad, top: y0 * UNIT - pad, w: (x1 - x0) * UNIT + 2 * pad, h: (y1 - y0) * UNIT + 2 * pad};
})();

const tone = (k) => (k === 0 ? 'var(--mv-tone-0)' : `var(--mv-tone-${k})`);
const vec = (p) => `(${p.map((v) => tnum(v)).join(p.some((v) => !Number.isInteger(Number(v.toFixed(2)))) ? ';\\ ' : ',\\ ')})`;
const near = (a, b) => Math.abs(a - b) < 1e-6;

export default function FitProjection3D({initial = [1, 0.5], pythagoras = false, caption}) {
  const [c, setC] = useState(initial);
  const [phi, setPhi] = useState(PHI0);
  const [anim, setAnim] = useState({kind: null, from: initial, phiFrom: PHI0, phiTo: PHI0});

  const duration = 2.2;
  const {t, play, playing} = useAnimation({duration, autoplay: false});
  const k = stage(t, 0, duration);
  const shownC = playing && anim.kind === 'foot' ? [anim.from[0] + (FOOT_C[0] - anim.from[0]) * k, anim.from[1] + (FOOT_C[1] - anim.from[1]) * k] : c;
  const shownPhi = playing && anim.kind === 'view' ? anim.phiFrom + (anim.phiTo - anim.phiFrom) * k : phi;

  const P = camera(shownPhi);
  const S = (p) => {
    const [x, y] = P(p);
    return [x * UNIT - FRAME.left, y * UNIT - FRAME.top];
  };
  const pts = (list) => list.map((p) => S(p).map((v) => v.toFixed(1)).join(',')).join(' ');

  const Ac = comb(...shownC);
  const r = sub(B, Ac);
  const sqe = dot(r, r);
  const ra = dot(r, A);
  const r1 = dot(r, ONE);
  const atFoot = near(shownC[0], FOOT_C[0]) && near(shownC[1], FOOT_C[1]);
  const w = sub(Ac, FOOT);
  const w2 = dot(w, w);

  const line = (p, q, props) => {
    const [x1, y1] = S(p);
    const [x2, y2] = S(q);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} {...props} />;
  };
  const arrow = (p, q, k2, width = 2.4, key) => {
    const [x1, y1] = S(p);
    const [x2, y2] = S(q);
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 3) return null;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const h = Math.min(11, len * 0.5);
    const head = `${x2},${y2} ${x2 - ux * h - uy * h * 0.45},${y2 - uy * h + ux * h * 0.45} ${x2 - ux * h + uy * h * 0.45},${y2 - uy * h - ux * h * 0.45}`;
    return (
      <g key={key}>
        <line x1={x1} y1={y1} x2={x2 - ux * h * 0.8} y2={y2 - uy * h * 0.8} stroke={tone(k2)} strokeWidth={width} />
        <polygon points={head} fill={tone(k2)} />
      </g>
    );
  };
  const label = (p, math, k2, dx = 0, dy = 0, anchor = 'middle') => {
    const [x, y] = S(p);
    return <SvgMath x={x + dx} y={y + dy} math={math} tone={k2} fontSize={14} anchor={anchor} halo />;
  };

  // marca de ângulo reto no pé H, entre a direção até b e uma direção do plano
  const rightMark = () => {
    const toB = sub(B, FOOT);
    const lb = Math.sqrt(dot(toB, toB));
    let along = atFoot || w2 < 1e-6 ? times(-1, FOOT) : w;
    const la = Math.sqrt(dot(along, along));
    const s = 0.28;
    const e1 = times(s / la, along);
    const e2 = times(s / lb, toB);
    return <polyline points={pts([add(FOOT, e1), add(add(FOOT, e1), e2), add(FOOT, e2)])} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.3} />;
  };

  const grid = [];
  for (let m = M_RANGE[0]; m <= M_RANGE[1] + 1e-9; m += 0.5) grid.push([comb(m, N_RANGE[0]), comb(m, N_RANGE[1])]);
  for (let n = N_RANGE[0]; n <= N_RANGE[1] + 1e-9; n += 0.5) grid.push([comb(M_RANGE[0], n), comb(M_RANGE[1], n)]);

  const edge = Math.abs(shownPhi - PHI_EDGE) < 0.6;
  // rótulo de A c do lado oposto a b na tela, longe do segmento verde
  const acOff = (() => {
    const [ax, ay] = S(Ac);
    const [bx, by] = S(B);
    const len = Math.hypot(ax - bx, ay - by);
    if (len < 4) return [-22, 14];
    return [((ax - bx) / len) * 24, ((ay - by) / len) * 20];
  })();
  const axisNames = ['\\text{ponto 1}', '\\text{ponto 2}', '\\text{ponto 3}'];

  const goFoot = () => {
    setAnim({kind: 'foot', from: c, phiFrom: phi, phiTo: phi});
    setC(FOOT_C);
    play();
  };
  const goView = (target) => {
    setAnim({kind: 'view', from: c, phiFrom: phi, phiTo: target});
    setPhi(target);
    play();
  };

  return (
    <div className={shared.wrapper} data-explorer={pythagoras ? 'fit-projection-3d-pythagoras' : 'fit-projection-3d'}>
      <figure style={{margin: 0}}>
        <svg
          viewBox={`0 0 ${FRAME.w.toFixed(1)} ${FRAME.h.toFixed(1)}`}
          style={{width: '100%', maxWidth: FRAME.w, display: 'block', margin: '0 auto'}}
          role="img"
          aria-label="O plano das colunas, o vetor b fora dele e o segmento de b até a lista de previsões"
        >
          {/* eixos */}
          {AXES.map((e, i) => (
            <g key={`ax${i}`}>
              {arrow([0, 0, 0], e, 0, 1.2)}
              {label(e, axisNames[i], 0, 0, i === 2 ? -12 : 14)}
            </g>
          ))}
          {/* plano das colunas */}
          <polygon points={pts(PATCH)} fill={tone(2)} fillOpacity={0.1} stroke={tone(2)} strokeOpacity={0.5} strokeWidth={1} />
          {grid.map(([p, q], i) => (
            <g key={`g${i}`}>{line(p, q, {stroke: tone(2), strokeOpacity: 0.22, strokeWidth: 0.8})}</g>
          ))}
          {/* colunas */}
          {arrow([0, 0, 0], A, 2, 2.4, 'a')}
          {arrow([0, 0, 0], ONE, 2, 2.4, 'u')}
          {/* b */}
          {arrow([0, 0, 0], B, 1, 2.6, 'b')}

          {pythagoras && !atFoot && (
            <>
              <polygon points={pts([B, FOOT, Ac])} fill={tone(3)} fillOpacity={0.08} />
              {line(FOOT, Ac, {stroke: tone(2), strokeWidth: 1.8, strokeDasharray: '5 4'})}
              {line(FOOT, B, {stroke: tone(3), strokeWidth: 2})}
              {rightMark()}
              <circle cx={S(FOOT)[0]} cy={S(FOOT)[1]} r={3.5} fill={tone(3)} />
            </>
          )}
          {/* o resto: de A c até b */}
          {line(Ac, B, {stroke: pythagoras && !atFoot ? 'var(--mv-tone-0)' : tone(3), strokeWidth: 2.4, strokeDasharray: atFoot ? undefined : '6 4'})}
          {atFoot && rightMark()}
          <circle cx={S(Ac)[0]} cy={S(Ac)[1]} r={5} fill={tone(2)} />

          {label(times(0.6, A), '\\vec{a}', 2, 10, 4, 'start')}
          {label(ONE, '\\vec{1}', 2, 10, 12, 'start')}
          {label(B, '\\vec{b}', 1, 0, -14)}
          {label(Ac, 'A\\vec{c}', 2, acOff[0], acOff[1])}
          {pythagoras && !atFoot && label(FOOT, 'H', 3, 12, 10, 'start')}
        </svg>
        <figcaption className={shared.caption}>
          {caption ??
            'Três pontos, (0, 2), (1, 1) e (2, 3): cada eixo guarda o valor de um ponto. O plano laranja é feito de todas as listas de previsões m a + n 1; as setas laranja são as colunas a e 1. A seta azul é b, a lista dos valores observados, fora do plano. O segmento verde vai da lista de previsões A c até b: o quadrado do tamanho dele é a soma dos quadrados dos erros.'}
        </figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`A\\vec{c} = ${tnum(shownC[0])}\\,(0,\\ 1,\\ 2) + ${tnum(shownC[1])}\\,(1,\\ 1,\\ 1) = ${vec(Ac)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`{\\vec{b} - A\\vec{c} = ${vec(r)}},`} />{' '}
          <span style={{display: 'inline-block', width: '1.5em'}} />{' '}
          <Formula math={`{\\text{SQE} = \\lVert \\vec{b} - A\\vec{c} \\rVert^2 = ${tnum(sqe, 4)}}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`{(\\vec{b} - A\\vec{c}) \\cdot \\vec{a} = ${tnum(ra, 3)}},`} />{' '}
          <span style={{display: 'inline-block', width: '1.5em'}} />{' '}
          <Formula math={`{(\\vec{b} - A\\vec{c}) \\cdot \\vec{1} = ${tnum(r1, 3)}}`} />
        </p>
        {pythagoras && (
          <p className={shared.formula}>
            <Formula math={`\\text{SQE} = \\underbrace{1{,}5}_{\\lVert \\vec{b} - H \\rVert^2} + \\underbrace{${tnum(w2, 4)}}_{\\lVert A\\vec{c} - H \\rVert^2} = ${tnum(1.5 + w2, 4)}`} />
          </p>
        )}
        <p>
          {atFoot
            ? 'Os dois produtos escalares dão zero: o resto é perpendicular às duas colunas, logo ao plano inteiro. É o pé da perpendicular, e a soma dos quadrados chega ao menor valor possível, 1,5.'
            : pythagoras
              ? `A c está a ${pnum(Math.sqrt(w2), 2)} de H, dentro do plano. Pelo triângulo retângulo, a soma dos quadrados passa de 1,5 exatamente pelo quadrado dessa distância.`
              : 'Algum produto escalar não é zero: o resto não está em ângulo reto com o plano, e dá para chegar mais perto de b.'}
        </p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Peso da coluna a: <strong>m = {pnum(c[0])}</strong>
          </span>
          <input type="range" min={M_RANGE[0]} max={M_RANGE[1]} step={0.25} value={c[0]} disabled={playing} onChange={(e) => setC([Number(e.target.value), c[1]])} aria-label="Peso m" />
        </label>
        <label className={shared.control}>
          <span>
            Peso da coluna 1: <strong>n = {pnum(c[1])}</strong>
          </span>
          <input type="range" min={N_RANGE[0]} max={N_RANGE[1]} step={0.25} value={c[1]} disabled={playing} onChange={(e) => setC([c[0], Number(e.target.value)])} aria-label="Peso n" />
        </label>
        <label className={shared.control}>
          <span>
            Girar a cena: <strong>{pnum(Math.round(shownPhi), 0)}°</strong>
            {edge ? ' (plano de perfil)' : ''}
          </span>
          <input type="range" min={-80} max={60} step={1} value={Math.round(phi)} disabled={playing} onChange={(e) => setPhi(Number(e.target.value))} aria-label="Giro da cena" />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" disabled={playing || atFoot} onClick={goFoot}>
          Levar A c ao pé da perpendicular
        </button>
        <button type="button" disabled={playing} onClick={() => goView(PHI_EDGE)}>
          Ver o plano de perfil
        </button>
        <button type="button" disabled={playing} onClick={() => goView(PHI0)}>
          Vista inicial
        </button>
      </div>
    </div>
  );
}
