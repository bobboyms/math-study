import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {arcPath, stage} from '../mathviz/useAnimation';
import {num} from '../WaveTracer/wave';

// De onde vêm as parcelas de sen(a + b) e cos(a + b).
//
// 1. O triângulo retângulo do ângulo b aparece deitado no eixo: hipotenusa 1
//    (o raio até P), cateto deitado cos b (tom 1, até R), cateto em pé sen b
//    (tom 2, de R até P).
// 2. O triângulo inteiro gira a em torno da origem. P vai para o ângulo a + b.
//    Toda direção gira a: o cateto que estava em pé passa a fazer o ângulo a
//    com a vertical (marcado em P).
// 3. Cada cateto se separa numa parte vertical e numa horizontal:
//    - part="sen": altura de P = altura de R (cos b × sen a, tom 1) + subida
//      de R até P (sen b × cos a, tom 2). Régua vertical à direita.
//    - part="cos": abscissa de P = avanço até R (cos b × cos a, tom 1) menos
//      o recuo de R até P (sen b × sen a, tom 2). Régua horizontal embaixo.
//
// `backward`: o segundo giro é para trás (a − b). O triângulo fica do outro
// lado do raio, e o cateto laranja aponta para baixo e para a direita.
// `double`: b = a, um deslizante só (arco duplo).
// `toggle`: botões para trocar entre seno e cosseno.

const U = 140;
const DURATION = 4.4;
const rad = (d) => (d * Math.PI) / 180;

function layout(part, backward, toggle) {
  const sen = part === 'sen' && !toggle;
  const cos = part === 'cos' && !toggle;
  // Com `backward`, o giro para trás nunca passa de a: P fica no primeiro
  // quadrante, e basta o quarto de círculo.
  return {
    xmin: backward ? -0.3 : -1.14,
    xmax: cos ? 1.22 : 2.3,
    // no começo da animação o rótulo cos b fica logo abaixo do eixo
    ymin: sen ? -0.26 : -0.82,
    ymax: 1.12,
    rulerX: 1.36,
    rulerY: -0.3,
    arc: backward ? [0, Math.PI / 2] : [0, Math.PI],
  };
}

export default function AngleSumRotation({
  a: a0 = 40,
  b: b0 = 30,
  part: part0 = 'sen',
  backward = false,
  double = false,
  toggle = false,
  caption,
}) {
  const [a, setA] = useState(a0);
  const [bFree, setB] = useState(b0);
  const [part, setPart] = useState(part0);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const b = double ? a : backward ? Math.min(bFree, a) : bFree;
  const bs = backward ? -b : b; // giro com sinal
  const L = layout(part, backward, toggle);
  const W = Math.round((L.xmax - L.xmin) * U);
  const H = Math.round((L.ymax - L.ymin) * U);
  const X = (x) => (x - L.xmin) * U;
  const Y = (y) => (L.ymax - y) * U;

  const rotP = stage(t, 0.7, 2.4);
  const show = stage(t, 2.6, 3.5);
  const rot = rad(a) * rotP;
  const B = rad(bs);
  const cb = Math.cos(B);
  const dir = [Math.cos(rot), Math.sin(rot)];
  const Rm = [cb * dir[0], cb * dir[1]];
  const Pm = [Math.cos(rot + B), Math.sin(rot + B)];
  const Cm = [Pm[0], Rm[1]];
  const sgn = bs >= 0 ? 1 : -1;
  const perp = [-sgn * dir[1], sgn * dir[0]]; // de R para P

  const O = [X(0), Y(0)];
  const pR = [X(Rm[0]), Y(Rm[1])];
  const pP = [X(Pm[0]), Y(Pm[1])];
  const pC = [X(Cm[0]), Y(Cm[1])];

  // rótulos dos catetos
  const nameA = 'a';
  const nameB = double ? 'a' : 'b';
  const off1 = [-perp[0] * 22, perp[1] * 22]; // longe de P (y do SVG invertido)
  const lab1 = [O[0] + 0.62 * (pR[0] - O[0]) + off1[0], O[1] + 0.62 * (pR[1] - O[1]) + off1[1]];
  const lab2 = [(pR[0] + pP[0]) / 2 + dir[0] * 30, (pR[1] + pP[1]) / 2 - dir[1] * 30];

  // marca de ângulo reto em R (entre R→O e R→P) e em C
  const sq = 0.065;
  const rq = (p, u1, u2) => {
    const q1 = [p[0] + u1[0] * sq, p[1] + u1[1] * sq];
    const q3 = [p[0] + u2[0] * sq, p[1] + u2[1] * sq];
    const q2 = [q1[0] + u2[0] * sq, q1[1] + u2[1] * sq];
    return `M ${X(q1[0])} ${Y(q1[1])} L ${X(q2[0])} ${Y(q2[1])} L ${X(q3[0])} ${Y(q3[1])}`;
  };
  const sqR = Math.abs(bs) > 6 && cb > 0.12 ? rq(Rm, [-dir[0], -dir[1]], perp) : null;
  const vUp = Pm[1] >= Rm[1] ? 1 : -1;
  const hDir = Pm[0] >= Rm[0] ? 1 : -1;
  const hLen = Math.abs(Pm[0] - Rm[0]);
  const vLen = Math.abs(Pm[1] - Rm[1]);
  const sqC = hLen > 0.09 && vLen > 0.09 ? rq(Cm, [-hDir, 0], [0, vUp]) : null;

  // ângulo a em P, entre P→C (vertical) e P→R
  const angP = (() => {
    if (a < 8 || vLen < 0.16 || Math.abs(bs) < 8) return null;
    const toC = vUp > 0 ? -Math.PI / 2 : Math.PI / 2;
    const toR = Math.atan2(Rm[1] - Pm[1], Rm[0] - Pm[0]);
    let a1 = toC;
    let a2 = toR;
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    if (d < 0) [a1, a2] = [a1 + d, a1];
    else a2 = a1 + d;
    const r = 0.13 * U;
    const mid = (a1 + a2) / 2;
    return {
      path: arcPath(pP[0], pP[1], r, a1, a2),
      lx: pP[0] + 0.24 * U * Math.cos(mid),
      ly: pP[1] - 0.24 * U * Math.sin(mid),
    };
  })();

  // números
  const sa = Math.sin(rad(a));
  const ca = Math.cos(rad(a));
  const sbv = Math.sin(rad(b));
  const cbv = Math.cos(rad(b));
  const part1 = part === 'sen' ? sa * cbv : ca * cbv;
  const part2 = part === 'sen' ? ca * sbv : sa * sbv;
  const n = (v) => num(v, 3);
  const dA = `${a}^\\circ`;
  const dB = `${b}^\\circ`;

  let lhs;
  let rhs;
  let nums;
  let total;
  if (part === 'sen') {
    total = Math.sin(rad(a + bs));
    if (double) {
      lhs = `\\sen(2 \\times ${dA})`;
      rhs = `2\\sen ${dA}\\cos ${dA}`;
      nums = `2 \\times ${n(sa)} \\times ${n(ca)}`;
    } else {
      lhs = `\\sen(${dA} ${backward ? '-' : '+'} ${dB})`;
      rhs = `\\sen ${dA}\\cos ${dB} ${backward ? '-' : '+'} \\cos ${dA}\\sen ${dB}`;
      nums = `${n(sa)} \\times ${n(cbv)} ${backward ? '-' : '+'} ${n(ca)} \\times ${n(sbv)}`;
    }
  } else {
    total = Math.cos(rad(a + bs));
    if (double) {
      lhs = `\\cos(2 \\times ${dA})`;
      rhs = `\\cos^2 ${dA} - \\sen^2 ${dA}`;
      nums = `${n(ca)}^2 - ${n(sa)}^2`;
    } else {
      lhs = `\\cos(${dA} ${backward ? '-' : '+'} ${dB})`;
      rhs = `\\cos ${dA}\\cos ${dB} ${backward ? '+' : '-'} \\sen ${dA}\\sen ${dB}`;
      nums = `${n(ca)} \\times ${n(cbv)} ${backward ? '+' : '-'} ${n(sa)} \\times ${n(sbv)}`;
    }
  }

  // rótulos das parcelas na régua
  const lab = {
    sen1: double ? '\\sen a\\cos a' : `\\sen ${nameA}\\cos ${nameB}`,
    sen2: double ? '\\cos a\\sen a' : `\\cos ${nameA}\\sen ${nameB}`,
    cos1: double ? '\\cos a\\cos a' : `\\cos ${nameA}\\cos ${nameB}`,
    cos2: double ? '\\sen a\\sen a' : `\\sen ${nameA}\\sen ${nameB}`,
  };

  let sentence;
  if (part === 'sen') {
    if (double) sentence = 'As duas parcelas da altura são iguais, porque os dois giros são iguais. Por isso aparece o 2.';
    else if (backward) sentence = 'Girando para trás, o cateto laranja aponta para baixo: a altura de P é a altura de R menos a descida de R até P.';
    else sentence = 'A altura de P é a altura de R (azul) mais a subida de R até P (laranja).';
  } else if (double) {
    sentence = total < -1e-9
      ? 'Avança o quadrado do cosseno e recua o quadrado do seno. Aqui o recuo é maior: P ficou à esquerda do eixo vertical.'
      : 'Avança o quadrado do cosseno e recua o quadrado do seno.';
  } else if (backward) {
    sentence = 'Girando para trás, o cateto laranja aponta para a direita: a abscissa de P é o avanço até R mais o avanço de R até P.';
  } else {
    sentence = total < -1e-9
      ? 'A abscissa de P é o avanço até R (azul) menos o recuo de R até P (laranja). Aqui o recuo é maior que o avanço: P ficou à esquerda do eixo vertical, e o cosseno é negativo.'
      : 'A abscissa de P é o avanço até R (azul) menos o recuo de R até P (laranja).';
  }

  // régua
  const ruler = (() => {
    if (show <= 0) return null;
    if (part === 'sen') {
      const x = X(L.rulerX);
      const w = 0.13 * U;
      const y0 = Y(0);
      const yR = Y(Rm[1]);
      const yP = Y(Pm[1]);
      const l1y = (y0 + yR) / 2;
      let l2y = (yR + yP) / 2;
      if (Math.abs(l2y - l1y) < 20) l2y = l1y + (l2y <= l1y ? -20 : 20);
      // a parte que desce fica numa coluna ao lado, para não cobrir a azul
      const x2 = (yP - yR) * (yR - y0) < 0 ? x + w : x;
      const lx = x2 + w + 8;
      return (
        <g opacity={show}>
          <line x1={pR[0]} y1={yR} x2={x2 + w} y2={yR} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 4" />
          <line x1={pP[0]} y1={yP} x2={x2 + w} y2={yP} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 4" />
          <rect x={x} y={Math.min(y0, yR)} width={w} height={Math.abs(y0 - yR)} fill="var(--mv-tone-1)" fillOpacity={0.35} stroke="var(--mv-tone-1)" strokeWidth={2} />
          <rect x={x2} y={Math.min(yR, yP)} width={w} height={Math.abs(yR - yP)} fill="var(--mv-tone-2)" fillOpacity={0.35} stroke="var(--mv-tone-2)" strokeWidth={2} />
          {Math.abs(y0 - yR) > 4 && <SvgMath x={lx} y={l1y} math={lab.sen1} anchor="start" tone={1} fontSize={13} space={110} halo />}
          {Math.abs(yR - yP) > 4 && <SvgMath x={lx} y={l2y} math={lab.sen2} anchor="start" tone={2} fontSize={13} space={110} halo />}
        </g>
      );
    }
    const y = Y(L.rulerY);
    const h = 0.1 * U;
    const x0 = X(0);
    const xR = pR[0];
    const xP = pP[0];
    const l1x = (x0 + xR) / 2;
    const l2x = (xR + xP) / 2;
    return (
      <g opacity={show}>
        <line x1={xR} y1={pR[1]} x2={xR} y2={y + h} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={xP} y1={pP[1]} x2={xP} y2={y + h} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={x0} y1={y - 8} x2={x0} y2={y + h + 8} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
        <rect x={Math.min(x0, xR)} y={y} width={Math.abs(xR - x0)} height={h / 2} fill="var(--mv-tone-1)" fillOpacity={0.35} stroke="var(--mv-tone-1)" strokeWidth={2} />
        <rect x={Math.min(xR, xP)} y={y + h / 2} width={Math.abs(xP - xR)} height={h / 2} fill="var(--mv-tone-2)" fillOpacity={0.35} stroke="var(--mv-tone-2)" strokeWidth={2} />
        {Math.abs(xR - x0) > 4 && <SvgMath x={l1x} y={y + h + 14} math={lab.cos1} tone={1} fontSize={13} halo />}
        {Math.abs(xP - xR) > 4 && <SvgMath x={l2x} y={y + h + 36} math={lab.cos2} tone={2} fontSize={13} halo />}
      </g>
    );
  })();

  // partes de cada cateto no desenho
  const parts = (() => {
    if (show <= 0) return null;
    if (part === 'sen') {
      return (
        <g opacity={show}>
          <line x1={pR[0]} y1={Y(0)} x2={pR[0]} y2={pR[1]} stroke="var(--mv-tone-1)" strokeWidth={3} strokeDasharray="6 3" />
          <line x1={pR[0]} y1={pR[1]} x2={pC[0]} y2={pC[1]} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="3 3" />
          <line x1={pC[0]} y1={pC[1]} x2={pP[0]} y2={pP[1]} stroke="var(--mv-tone-2)" strokeWidth={3} strokeDasharray="6 3" />
        </g>
      );
    }
    return (
      <g opacity={show}>
        <line x1={pR[0]} y1={pR[1]} x2={pR[0]} y2={Y(0)} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="3 3" />
        <line x1={O[0]} y1={Y(0)} x2={pR[0]} y2={Y(0)} stroke="var(--mv-tone-1)" strokeWidth={4} strokeDasharray="6 3" />
        <line x1={pC[0]} y1={pC[1]} x2={pP[0]} y2={pP[1]} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="3 3" />
        <line x1={pR[0]} y1={pR[1]} x2={pC[0]} y2={pC[1]} stroke="var(--mv-tone-2)" strokeWidth={3} strokeDasharray="6 3" />
      </g>
    );
  })();

  const arcA = a * rotP > 3 ? arcPath(O[0], O[1], 0.2 * U, 0, rot) : null;
  const arcB = Math.abs(bs) > 3
    ? (bs > 0 ? arcPath(O[0], O[1], 0.36 * U, rot, rot + B) : arcPath(O[0], O[1], 0.36 * U, rot + B, rot))
    : null;
  const labA = [O[0] + 0.29 * U * Math.cos(rot / 2), O[1] - 0.29 * U * Math.sin(rot / 2) + 2];
  const labB = [O[0] + 0.47 * U * Math.cos(rot + B / 2), O[1] - 0.47 * U * Math.sin(rot + B / 2)];
  const labP = [pP[0] + 16 * Math.cos(rot + B), pP[1] - 16 * Math.sin(rot + B)];
  const labR = [pR[0] - perp[0] * 13 + dir[0] * 10, pR[1] + perp[1] * 13 - dir[1] * 10];

  return (
    <div className={shared.wrapper} data-explorer="angle-sum-rotation">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Triângulo retângulo de hipotenusa 1 e ângulo b, girado de a em torno da origem. Cada cateto se separa numa parte vertical e numa horizontal.">
          {/* eixos e o ciclo */}
          <line x1={X(L.xmin) + 4} y1={Y(0)} x2={X(Math.min(L.xmax, 1.18))} y2={Y(0)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <line x1={X(0)} y1={Y(-0.06)} x2={X(0)} y2={Y(1.1)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={arcPath(O[0], O[1], U, L.arc[0], L.arc[1])} fill="none" stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="4 4" />
          {/* o raio na direção a */}
          <line x1={O[0]} y1={O[1]} x2={X(dir[0] * 1.08)} y2={Y(dir[1] * 1.08)} stroke="var(--mv-guide)" strokeWidth={1} />

          {parts}

          {/* o triângulo */}
          <line x1={O[0]} y1={O[1]} x2={pP[0]} y2={pP[1]} stroke="var(--ifm-font-color-base)" strokeWidth={2.25} />
          <line x1={O[0]} y1={O[1]} x2={pR[0]} y2={pR[1]} stroke="var(--mv-tone-1)" strokeWidth={4} strokeLinecap="round" />
          <line x1={pR[0]} y1={pR[1]} x2={pP[0]} y2={pP[1]} stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinecap="round" />
          {sqR && <path d={sqR} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.25} />}
          {show > 0 && sqC && <path d={sqC} fill="none" stroke="var(--mv-guide)" strokeWidth={1.25} opacity={show} />}
          {show > 0 && angP && (
            <g opacity={show}>
              <path d={angP.path} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
              <SvgMath x={angP.lx} y={angP.ly} math={nameA} fontSize={13} halo />
            </g>
          )}

          {arcA && <path d={arcA} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />}
          {arcB && <path d={arcB} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />}
          {a * rotP >= 12 && <SvgMath x={labA[0]} y={labA[1]} math={nameA} fontSize={13} halo />}
          {Math.abs(bs) >= 10 && <SvgMath x={labB[0]} y={labB[1]} math={nameB} fontSize={13} halo />}

          {cb > 0.15 && <SvgMath x={lab1[0]} y={lab1[1]} math={`\\cos ${nameB}`} tone={1} fontSize={13} halo />}
          {Math.abs(bs) >= 12 && <SvgMath x={lab2[0]} y={lab2[1]} math={`\\sen ${nameB}`} tone={2} fontSize={13} halo />}

          <circle cx={O[0]} cy={O[1]} r={3.5} fill="var(--ifm-font-color-base)" />
          <circle cx={pR[0]} cy={pR[1]} r={3.5} fill="var(--mv-tone-1)" />
          <circle cx={pP[0]} cy={pP[1]} r={4.5} fill="var(--ifm-font-color-base)" />
          <SvgMath x={labP[0]} y={labP[1]} math="P" fontSize={14} halo />
          {Math.abs(bs) >= 12 && <SvgMath x={labR[0]} y={labR[1]} math="R" fontSize={13} halo />}
          <SvgMath x={O[0] - 10} y={O[1] + 12} math="O" fontSize={13} />

          {ruler}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? (part === 'sen'
            ? 'O triângulo de hipotenusa 1 gira de a em torno da origem. A altura de P se separa em dois pedaços: a altura de R (azul tracejado) e a subida de R até P (laranja tracejado). A régua da direita empilha os dois.'
            : 'O mesmo triângulo girado. A abscissa de P se separa em dois pedaços: o avanço até R (azul tracejado) e o recuo de R até P (laranja tracejado). A régua de baixo mostra o avanço e, logo abaixo, o recuo.')}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>{rotP < 1 ? 'O triângulo está girando em torno da origem.' : 'Cada cateto se separa numa parte vertical e numa horizontal.'}</p>
        ) : (
          <>
            <div className={shared.formula}>
              <Formula math={`${lhs} = ${rhs} \\approx ${nums} \\approx ${n(part1 + (backward ? -1 : 1) * (part === 'sen' ? 1 : -1) * part2)}`} />
            </div>
            <p>
              {sentence} Conferindo direto:{' '}
              <Formula math={`${part === 'sen' ? '\\sen' : '\\cos'} ${a + bs}^\\circ \\approx ${n(total)}`} />.
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>{double ? 'Giro a (girado duas vezes)' : 'Primeiro giro a'}: {a}°</span>
          <input type="range" min={0} max={90} step={5} value={a} disabled={playing}
            onChange={(e) => setA(Number(e.target.value))} aria-label="Giro a, em graus" />
        </label>
        {!double && (
          <label className={shared.control}>
            <span>{backward ? 'Giro para trás b' : 'Segundo giro b'}: {b}°</span>
            <input type="range" min={0} max={backward ? a : 90} step={5} value={b} disabled={playing}
              onChange={(e) => setB(Number(e.target.value))} aria-label={backward ? 'Giro para trás b, em graus' : 'Segundo giro b, em graus'} />
          </label>
        )}
      </div>
      <div className={shared.buttons}>
        {toggle && (
          <>
            <button type="button" onClick={() => setPart('sen')} disabled={playing} aria-pressed={part === 'sen'}>Ver a altura (seno)</button>
            <button type="button" onClick={() => setPart('cos')} disabled={playing} aria-pressed={part === 'cos'}>Ver a abscissa (cosseno)</button>
          </>
        )}
        <button type="button" onClick={() => play()}>Girar o triângulo de novo</button>
      </div>
    </div>
  );
}
