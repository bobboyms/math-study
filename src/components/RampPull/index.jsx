import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage, fmt} from '../mathviz/useAnimation';

// O carrinho puxado rampa acima (lição 7.31, Produto escalar).
//
// A rampa avança 8 m e sobe 6 m: o deslocamento é d = (8, 6), de 10 m. A
// corda puxa com 50 N na direção de F = (30, 40), mais inclinada que a rampa.
// Escala da força: 1 unidade do desenho para 10 N, e a seta de F mede 5.
//
// mode="question": o carrinho sobe a rampa puxado pela corda; no fim aparecem
// o ângulo θ entre a corda e a rampa, com um ponto de interrogação, e a seta d.
//
// mode="solved": a força se divide em duas partes, uma ao longo da rampa (a
// que empurra o carrinho) e outra em ângulo reto com ela (a que só puxa o
// carrinho para fora do piso). Um controle muda o ângulo entre a corda e a
// rampa, sempre com 50 N; botões levam aos três casos da tabela da lição.

const E = [0.8, 0.6]; // direção da rampa
const N = [-0.6, 0.8]; // perpendicular à rampa, para cima
const RAMP = Math.atan2(6, 8);
const PROBLEM = Math.atan2(4, 3) - RAMP; // ≈ 16,26°
const F_LEN = 5; // 50 N
const S_CART = 4; // centro do carrinho, em metros ao longo da rampa
const CART_HALF = 0.6;
const CART_H = 0.8;
const DURATION = 3.6;

const add = (p, q, k = 1) => [p[0] + k * q[0], p[1] + k * q[1]];
const along = (s, h = 0) => add([s * E[0], s * E[1]], N, h);

const comma = (v, d) => fmt(v, d).replace(',', '{,}');
const clean = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : comma(v, 1));
const cleanTex = (v) => (v < 0 ? `-${clean(-v)}` : clean(v));
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const deg = (r) => (r * 180) / Math.PI;

function cart(s) {
  return [along(s - CART_HALF), along(s + CART_HALF), along(s + CART_HALF, CART_H), along(s - CART_HALF, CART_H)];
}

export default function RampPull({mode = 'question', caption}) {
  const solved = mode === 'solved';
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const [theta, setTheta] = useState(PROBLEM);

  // Na pergunta, o carrinho sobe de 1 m até 4 m; resolvido, ele já está lá e
  // as duas partes da força crescem a partir dele.
  const s = solved ? S_CART : 1 + (S_CART - 1) * stage(t, 0.2, 2.2);
  const c = along(s, CART_H / 2);
  const psi = RAMP + theta;
  const Fdir = [Math.cos(psi), Math.sin(psi)];
  const tip = add(c, Fdir, F_LEN);

  const polygons = [
    {points: [[0, 0], [8, 0], [8, 6]], tone: 0},
    {points: cart(s), tone: 0},
  ];
  const segments = [];
  const labels = [];
  const angles = [];

  if (!solved) {
    const kd = stage(t, 2.3, 3.2);
    segments.push({from: c, to: add(c, E, 3.4), tone: 0, dashed: true});
    segments.push({from: c, to: tip, tone: 2, arrow: true});
    labels.push({at: tip, math: '\\vec{F} = (30,\\ 40)', dx: 8, dy: -16, tone: 2});
    if (kd > 0.02) {
      segments.push({from: [0, 0], to: [8 * kd, 6 * kd], tone: 1, arrow: true});
    }
    if (kd >= 1) {
      labels.push({at: along(6.6), math: '\\vec{d} = (8,\\ 6)', dx: 30, dy: 40, tone: 1});
      angles.push({at: c, from: add(c, E, 2), to: tip, label: '\\theta = \\,?', tone: 3, radius: 60, labelRadius: 104});
    }
  } else {
    const k = stage(t, 0.3, 1.8);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const useful = 50 * cosT;
    const side = 50 * sinT;
    const pa = add(c, E, F_LEN * cosT * k);
    const pn = add(c, N, F_LEN * sinT * k);
    segments.push({from: c, to: add(c, E, -2.2), tone: 0, dashed: true});
    segments.push({from: c, to: add(c, E, 6.2), tone: 0, dashed: true});
    if (k > 0.05 && Math.abs(cosT) > 0.02) {
      segments.push({from: c, to: pa, tone: 1, arrow: true});
      segments.push({from: tip, to: pa, tone: 0, dashed: true});
    }
    if (k > 0.05 && sinT > 0.02) {
      segments.push({from: c, to: pn, tone: 3, arrow: true});
      segments.push({from: tip, to: pn, tone: 0, dashed: true});
    }
    segments.push({from: c, to: tip, tone: 2, arrow: true});
    labels.push({at: tip, math: '50\\ \\text{N}', dx: Fdir[0] >= 0 ? 24 : -24, dy: -12, tone: 2});
    if (k >= 1) {
      if (Math.abs(cosT) > 0.08) {
        labels.push({at: add(c, E, F_LEN * cosT), math: `${cleanTex(useful)}\\ \\text{N}`, dx: cosT > 0 ? 26 : -30, dy: 18, tone: 1});
      }
      if (sinT > 0.08) {
        labels.push({at: add(c, N, F_LEN * sinT), math: `${clean(side)}\\ \\text{N}`, dx: -30, dy: -6, tone: 3});
      }
      if (deg(theta) >= 30) {
        angles.push({at: c, from: add(c, E, 2), to: tip, label: `${comma(deg(theta), Math.abs(theta - PROBLEM) < 1e-9 ? 2 : 0)}^\\circ`, tone: 3, radius: 34, labelRadius: 60});
      }
    }
  }

  const F = [50 * Fdir[0], 50 * Fdir[1]];
  const dot = 8 * F[0] + 6 * F[1];
  const useful = dot / 10;

  const readout = solved ? (
    <>
      <p className={shared.formula}>
        <Formula
          math={`\\vec{F} ${isInt(F[0]) && isInt(F[1]) ? '=' : '\\approx'} (${cleanTex(F[0])}${isInt(F[0]) && isInt(F[1]) ? ',' : ';'}\\ ${cleanTex(F[1])}), \\qquad \\vec{F} \\cdot \\vec{d} ${isInt(F[0]) && isInt(F[1]) ? '=' : '\\approx'} 8 \\times ${F[0] < 0 ? `(${cleanTex(F[0])})` : cleanTex(F[0])} + 6 \\times ${F[1] < 0 ? `(${cleanTex(F[1])})` : cleanTex(F[1])} ${isInt(dot) ? '=' : '\\approx'} ${cleanTex(dot)}`}
        />
      </p>
      <p className={shared.formula}>
        <Formula math={`\\text{força útil} = \\dfrac{\\vec{F} \\cdot \\vec{d}}{10} ${isInt(useful) ? '=' : '\\approx'} ${cleanTex(useful)}\\ \\text{N}`} />
      </p>
      <p>
        {useful > 0.05
          ? 'A parte azul empurra o carrinho rampa acima. A parte verde só puxa o carrinho para fora do piso.'
          : useful < -0.05
            ? 'Com o ângulo maior que 90°, a parte ao longo da rampa aponta para baixo: a corda atrapalha a subida, e o produto escalar sai negativo.'
            : 'Com a corda em ângulo reto com a rampa, nenhuma parte da força empurra o carrinho ao longo dela: o produto escalar é zero.'}
      </p>
    </>
  ) : (
    <p>A corda puxa na direção de F, e o carrinho anda na direção de d. As duas setas não estão alinhadas.</p>
  );

  return (
    <div className={shared.wrapper} data-explorer="ramp-pull">
      <div ref={ref}>
        <GeoFigure
          unit={34}
          padding={30}
          bounds={[-2.6, -1.1, 8.8, 8.2]}
          polygons={polygons}
          segments={segments}
          angles={angles}
          labels={labels}
          caption={
            caption ??
            (solved
              ? 'A seta laranja é a força da corda, 50 N. A seta azul é a parte dela que segue a rampa; a verde é a parte em ângulo reto com a rampa. Os tracejados fecham o retângulo: as duas partes somadas dão a força inteira.'
              : 'O carrinho sobe a rampa na direção de d. A corda puxa na direção de F, mais inclinada. As duas setas estão em escalas diferentes: a de F mede 5 unidades para 50 N, e a de d mede 10 unidades para 10 m.')
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {readout}
      </div>
      {solved && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>Ângulo entre a corda e a rampa: {fmt(deg(theta), Math.abs(theta - PROBLEM) < 1e-9 ? 2 : 0)}°</span>
            <input
              type="range"
              min={0}
              max={180}
              step={1}
              value={Math.round(deg(theta))}
              onChange={(e) => setTheta((Number(e.target.value) * Math.PI) / 180)}
              aria-label="Ângulo entre a corda e a rampa, em graus"
            />
          </label>
        </div>
      )}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {solved ? 'Ver a força se dividir de novo' : 'Ver o carrinho subir de novo'}
        </button>
        {solved &&
          [
            ['Alinhada com a rampa', 0],
            ['Como no problema', PROBLEM],
            ['Em ângulo reto', Math.PI / 2],
            ['Obtusa, 120°', (2 * Math.PI) / 3],
          ].map(([name, value]) => (
            <button key={name} type="button" aria-pressed={Math.abs(theta - value) < 1e-9} onClick={() => setTheta(value)}>
              {name}
            </button>
          ))}
      </div>
    </div>
  );
}
