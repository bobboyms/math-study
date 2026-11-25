import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, bmatrix, frame, num, numText, pair} from '../LinearGridMorph/plane';
import {apply2} from '../DetGridMorph/det';
import {angleDeg, dot, svd2} from '../SvdCircleMorph/svd';

// A busca da direção que mais estica (lição 11.13).
//
// O aluno gira a seta v (comprimento 1) com o deslizante de ângulo e vê a
// seta Av e o seu comprimento. Embaixo, o gráfico do comprimento de Av (ou do
// quadrado dele, com `squared`) para todos os ângulos de 0° a 180°. O
// registro guarda o maior e o menor comprimento já vistos; quando o aluno
// chega ao máximo ou ao mínimo de verdade, a direção fica marcada em verde.
// Com os dois achados, a figura mostra que as duas direções de partida são
// perpendiculares, e as de chegada também.
//
// O deslizante anda de grau em grau; a menos de 1° de um extremo que não cai
// num grau inteiro, a seta é puxada para ele (um ímã). "Varrer" gira a seta
// de 0° a 180° e registra o que encontrar.

const MAGNET = 1;

const wrap180 = (a) => ((a % 180) + 180) % 180;

export default function SvdStretchSearch({
  matrix = [
    [3, 0],
    [4, 5],
  ],
  name = 'A',
  v1Hint = [1, 1],
  squared = false,
  initial = 0,
  window: win = [-7.5, 7.5, -7.5, 7.5],
  unit = 26,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const [deg, setDeg] = useState(initial);
  const [rec, setRec] = useState({max: null, min: null});
  const sweepRef = useRef(false);

  const d = svd2(matrix, v1Hint);
  const special = [
    {deg: wrap180(angleDeg(d.v1)), kind: 'max', s: d.s1, v: d.v1, Av: d.Av1},
    {deg: wrap180(angleDeg(d.v2)), kind: 'min', s: d.s2, v: d.v2, Av: d.Av2},
  ];

  const snapped = (x) => {
    for (const sp of special) {
      const dist = Math.min(Math.abs(x - sp.deg), 180 - Math.abs(x - sp.deg));
      if (dist < MAGNET) return sp;
    }
    return null;
  };
  const angleOf = (x) => {
    const sp = snapped(x);
    return sp ? sp.deg : x;
  };
  const lenAt = (a) => {
    const r = (a * Math.PI) / 180;
    const w = apply2(matrix, [Math.cos(r), Math.sin(r)]);
    return Math.hypot(w[0], w[1]);
  };

  const register = (x) => {
    const a = angleOf(x);
    const L = lenAt(a);
    setRec((old) => ({
      max: !old.max || L > old.max.L + 1e-12 ? {deg: a, L} : old.max,
      min: !old.min || L < old.min.L - 1e-12 ? {deg: a, L} : old.min,
    }));
  };

  const {ref, play, playing} = useAnimation({
    duration: 6,
    autoplay: false,
    onFrame: (tt, total) => {
      if (!sweepRef.current) return;
      const x = Math.min(179, Math.round((tt / total) * 180));
      setDeg(x);
      register(x);
      if (tt >= total) {
        // Garante o registro de todas as direções, mesmo quando a animação
        // pula direto para o fim (menos movimento).
        for (let k = 0; k < 180; k += 1) register(k);
        sweepRef.current = false;
      }
    },
  });

  const angle = angleOf(deg);
  const r = (angle * Math.PI) / 180;
  const v = [Math.cos(r), Math.sin(r)];
  const w = apply2(matrix, v);
  const L = Math.hypot(w[0], w[1]);
  const val = (x) => (squared ? x * x : x);

  const foundMax = rec.max && Math.abs(rec.max.L - d.s1) < 1e-9;
  const foundMin = rec.min && Math.abs(rec.min.L - d.s2) < 1e-9;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;

  const ell = [];
  for (let i = 0; i <= 120; i += 1) {
    const th = (i / 120) * 2 * Math.PI;
    ell.push(f.P(apply2(matrix, [Math.cos(th), Math.sin(th)])));
  }
  const ellPath = `M ${ell.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} Z`;

  // Gráfico: comprimento (ou quadrado) de Av contra o ângulo de v.
  const GW = f.W;
  const GH = 170;
  const gx0 = 48;
  const gx1 = GW - 16;
  const gy0 = 16;
  const gy1 = GH - 36;
  const top = val(d.s1) * 1.12;
  const GX = (a) => gx0 + ((gx1 - gx0) * a) / 180;
  const GY = (y) => gy1 - ((gy1 - gy0) * y) / top;
  let path = '';
  for (let i = 0; i <= 360; i += 1) {
    const a = i / 2;
    path += `${i ? ' L' : 'M'} ${GX(a).toFixed(1)} ${GY(val(lenAt(a))).toFixed(1)}`;
  }
  const ticks = squared ? [0, Math.round(d.l2), Math.round(d.l1)] : [0, d.s2, d.s1];
  const tickText = (y) => numText(y, squared ? 0 : 2);

  const both = foundMax && foundMin;
  const textColor = 'var(--ifm-color-emphasis-800)';

  // Coordenadas de v na base v1, v2 (modo ao quadrado).
  const a = dot(v, d.v1);
  const b = dot(v, d.v2);

  return (
    <div className={shared.wrapper} data-explorer="svd-stretch-search">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={`A seta v de comprimento 1 e a seta ${name}v`}>
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <Axes f={f} />
          <path d={ellPath} fill="none" stroke="var(--mv-guide)" strokeWidth={1.4} strokeDasharray="5 4" />
          <circle cx={f.X(0)} cy={f.Y(0)} r={f.unit} fill="none" stroke="var(--mv-guide)" strokeWidth={1.4} />
          {foundMax && (
            <>
              <Arrow f={f} to={d.Av1} tone={3} width={2} opacity={0.75} dashed label={playing ? null : `\\sigma_1 \\approx ${num(d.s1)}`} offset={[8, -6, 'start']} />
              <Arrow f={f} to={d.v1} tone={3} width={2} opacity={0.75} dashed />
            </>
          )}
          {foundMin && (
            <>
              <Arrow f={f} to={d.Av2} tone={3} width={2} opacity={0.75} dashed label={playing ? null : `\\sigma_2 \\approx ${num(d.s2)}`} offset={d.Av2[0] < 0 ? [-8, -8, 'end'] : [8, -8, 'start']} />
              <Arrow f={f} to={d.v2} tone={3} width={2} opacity={0.75} dashed />
            </>
          )}
          <Arrow f={f} to={w} tone={2} label={playing ? null : `${name}\\vec{v}`} offset={w[0] < 0 ? [-8, w[1] > 0 ? -10 : 14, 'end'] : [8, w[1] > 0 ? -10 : 14, 'start']} />
          <Arrow f={f} to={v} tone={1} label={playing ? null : '\\vec{v}'} offset={[v[0] >= 0 ? 10 : -10, v[1] >= 0 ? 16 : -10, v[0] >= 0 ? 'start' : 'end']} />
        </svg>
        <svg className={styles.svg} viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label={`Comprimento de ${name}v para cada ângulo de v`}>
          <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          {[0, 45, 90, 135, 180].map((x) => (
            <text key={x} x={GX(x)} y={gy1 + 15} textAnchor="middle" fontSize={11} fill={textColor}>
              {x}°
            </text>
          ))}
          {ticks.map((y, i) => (
            <g key={i}>
              {i > 0 && <line x1={gx0} y1={GY(val(i === 1 ? d.s2 : d.s1))} x2={gx1} y2={GY(val(i === 1 ? d.s2 : d.s1))} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 4" />}
              <text x={gx0 - 6} y={GY(i === 0 ? 0 : val(i === 1 ? d.s2 : d.s1)) + 4} textAnchor="end" fontSize={11} fill={textColor}>
                {i === 0 ? '0' : tickText(squared ? y : y)}
              </text>
            </g>
          ))}
          <text x={(gx0 + gx1) / 2} y={GH - 4} textAnchor="middle" fontSize={11} fill={textColor}>
            {squared ? `ângulo da seta v (a curva é o comprimento de ${name}v ao quadrado)` : `ângulo da seta v (a curva é o comprimento de ${name}v)`}
          </text>
          <path d={path} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.8} />
          {foundMax && <circle cx={GX(special[0].deg)} cy={GY(val(d.s1))} r={5} fill="var(--mv-tone-3)" />}
          {foundMin && <circle cx={GX(special[1].deg)} cy={GY(val(d.s2))} r={5} fill="var(--mv-tone-3)" />}
          <line x1={GX(angle)} y1={gy0} x2={GX(angle)} y2={gy1} stroke="var(--mv-tone-1)" strokeWidth={1.2} strokeDasharray="3 3" />
          <circle cx={GX(angle)} cy={GY(val(L))} r={4.5} fill="var(--mv-tone-1)" />
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Ângulo da seta v: <strong>{numText(angle, Math.abs(angle - Math.round(angle)) > 1e-6 ? 2 : 0)}°</strong>
          </span>
          <input
            type="range"
            min={0}
            max={179}
            step={1}
            value={deg}
            disabled={playing}
            onChange={(e) => {
              const x = Number(e.target.value);
              setDeg(x);
              register(x);
            }}
            aria-label="Ângulo da seta v, em graus"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`${name} = ${bmatrix(matrix, 2)}, \\qquad \\vec{v} = ${pair(v, 2)}, \\qquad ${name}\\vec{v} = ${pair(w, 2)}`} />
        </p>
        {squared ? (
          <p className={shared.formula}>
            <Formula
              math={`\\lVert ${name}\\vec{v} \\rVert^2 = ${num(L * L, 2)} = ${num(d.l1, 0)}a^2 + ${num(d.l2, 0)}b^2, \\quad a = ${num(a, 2)},\\ b = ${num(b, 2)}`}
            />
          </p>
        ) : (
          <p>
            Comprimento de {name}v: <strong>{numText(L, 2)}</strong>. A seta v tem comprimento 1, então {name} esticou v{' '}
            {numText(L, 2)} vezes.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            sweepRef.current = true;
            play();
          }}
        >
          Varrer todas as direções
        </button>
        <button type="button" disabled={playing || !rec.max} onClick={() => setRec({max: null, min: null})}>
          Limpar o registro
        </button>
      </div>
      <p className={shared.hint}>
        {!rec.max
          ? 'Registro: vazio. Gire a seta v e procure o maior e o menor comprimento de Av.'
          : `Registro: maior comprimento visto, ${numText(rec.max.L, 2)} (v a ${numText(rec.max.deg, Math.abs(rec.max.deg - Math.round(rec.max.deg)) > 1e-6 ? 2 : 0)}°)${
              foundMax ? ', que é o máximo' : ''
            }; menor comprimento visto, ${numText(rec.min.L, 2)} (v a ${numText(rec.min.deg, Math.abs(rec.min.deg - Math.round(rec.min.deg)) > 1e-6 ? 2 : 0)}°)${
              foundMin ? ', que é o mínimo' : ''
            }.${
              both
                ? ` As duas direções de partida estão a ${numText(Math.abs(special[1].deg - special[0].deg), 0)}° uma da outra, e as duas setas de chegada (verdes) também são perpendiculares.`
                : ' Continue procurando.'
            }`}
      </p>
    </div>
  );
}
