import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {arcPath, onCircle, stage} from '../mathviz/useAnimation';
import {num} from '../WaveTracer/wave';

// Dois giros seguidos: a altura não se soma.
//
// Um braço de comprimento `length` gira `a` e depois mais `b`. A figura mostra:
// - tom 1: a altura depois do primeiro giro (sen a);
// - tom 2: a subida de verdade do segundo giro, que começa em a;
// - tom 3: a subida que o mesmo giro b daria começando do zero (sen b), que é
//   o que a regra errada "sen(a + b) = sen a + sen b" soma.
// À direita, duas barras no mesmo chão: "somando" (tom 1 + tom 3) e "de
// verdade" (tom 1 + tom 2), com a linha do comprimento do braço. A barra
// "somando" pode passar da linha; a de verdade nunca passa.
//
// Na abertura o braço gira a, depois b, e as barras crescem. Com `sliders`,
// o aluno escolhe a e b (0° a 90°, de 5 em 5).
//
// `mystery`: no problema motivador, a barra de verdade sai com "?" no lugar do
// número.

const R = 110;
const DURATION = 5;
const rad = (d) => (d * Math.PI) / 180;

export default function AngleSumRise({
  a: a0 = 30,
  b: b0 = 30,
  length = 1,
  unit = '',
  sliders = false,
  mystery = false,
  caption,
}) {
  const [a, setA] = useState(a0);
  const [b, setB] = useState(b0);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const s1 = stage(t, 0.3, 1.5);
  const s2 = stage(t, 1.9, 3.1);
  const s3 = stage(t, 3.4, 4.6);
  const theta = s2 > 0 ? a + b * s2 : a * s1;

  const sa = Math.sin(rad(a));
  const sb = Math.sin(rad(b));
  const sab = Math.sin(rad(a + b));
  const rise = sab - sa;

  const maxH = sliders ? 2 : Math.max(sa + sb, 1) + 0.12;
  const OX = R + 40;
  const OY = Math.round(maxH * R + 34);
  const BAR1 = OX + R + 56;
  const BAR2 = BAR1 + 78;
  const BW = 34;
  const W = BAR2 + BW + 74;
  const H = OY + 56;
  const Y = (u) => OY - u * R;
  // número em cima da barra, sem encostar na linha do comprimento do braço
  const valueY = (top) => {
    const y = Y(top) - 13;
    return Math.abs(y - Y(1)) < 11 ? Y(1) - 13 : y;
  };

  const [px, py] = onCircle(OX, OY, R, rad(theta));
  const [p1x, p1y] = onCircle(OX, OY, R, rad(Math.min(theta, a)));
  const [qx, qy] = onCircle(OX, OY, R, rad(b));
  const curH = Math.sin(rad(theta));

  const u = unit ? `\\ \\text{${unit}}` : '';
  const val = (v) => `${num(v * length, 2)}${u}`;
  const degA = `${a}^\\circ`;
  const degB = `${b}^\\circ`;

  // barras
  const barTop1 = sa + sb * s3;
  const barTop2 = sa + rise * s3;

  return (
    <div className={shared.wrapper} data-explorer="angle-sum-rise">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Braço que gira ${a} graus e depois mais ${b} graus. A altura final não é a soma das duas subidas medidas a partir do zero.`}>
          {/* chão e meia circunferência que a ponta do braço percorre */}
          <line x1={OX - R - 16} y1={OY} x2={BAR2 + BW + 20} y2={OY} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={arcPath(OX, OY, R, 0, Math.PI)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="4 4" />
          {/* altura máxima possível: o comprimento do braço */}
          <line x1={OX} y1={Y(1)} x2={BAR2 + BW + 20} y2={Y(1)} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="6 4" />
          <SvgMath x={BAR2 + BW + 24} y={Y(1)} math={unit ? `${num(length, 2)}${u}` : '1'} anchor="start" fontSize={12} space={70} />

          {/* o giro b começando do zero (tom 3), que a regra errada soma */}
          {s3 > 0 && (
            <g opacity={s3}>
              <line x1={OX} y1={OY} x2={qx} y2={qy} stroke="var(--mv-tone-3)" strokeWidth={1.25} strokeDasharray="3 3" />
              <line x1={qx} y1={OY} x2={qx} y2={qy} stroke="var(--mv-tone-3)" strokeWidth={3} strokeLinecap="round" />
              <circle cx={qx} cy={qy} r={3.5} fill="var(--mv-tone-3)" />
            </g>
          )}

          {/* braço no primeiro giro, que fica como fantasma */}
          {s2 > 0 && <line x1={OX} y1={OY} x2={p1x} y2={p1y} stroke="var(--mv-guide)" strokeWidth={2} strokeDasharray="5 4" />}
          {/* altura depois do primeiro giro (tom 1) */}
          {theta > 0.5 && <line x1={p1x} y1={OY} x2={p1x} y2={p1y} stroke="var(--mv-tone-1)" strokeWidth={3.5} strokeLinecap="round" />}
          {/* subida de verdade do segundo giro (tom 2) */}
          {s2 > 0 && (
            <g>
              <line x1={p1x} y1={p1y} x2={px} y2={p1y} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={px} y1={p1y} x2={px} y2={py} stroke="var(--mv-tone-2)" strokeWidth={3.5} strokeLinecap="round" />
            </g>
          )}

          {/* ângulos */}
          {Math.min(theta, a) > 1 && (
            <path d={arcPath(OX, OY, 26, 0, rad(Math.min(theta, a)))} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} />
          )}
          {s2 > 0 && b > 0 && (
            <path d={arcPath(OX, OY, 40, rad(a), rad(theta))} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.75} />
          )}
          {a >= 15 && !playing && (() => {
            const [lx, ly] = onCircle(OX, OY, 50, rad(a / 2));
            return <SvgMath x={lx + 4} y={ly} math={sliders ? 'a' : degA} tone={1} fontSize={12} halo />;
          })()}
          {b >= 15 && !playing && (() => {
            const [lx, ly] = onCircle(OX, OY, 66, rad(a + b / 2));
            return <SvgMath x={lx} y={ly} math={sliders ? 'b' : degB} tone={2} fontSize={12} halo />;
          })()}

          {/* o braço */}
          <line x1={OX} y1={OY} x2={px} y2={py} stroke="var(--ifm-font-color-base)" strokeWidth={4} strokeLinecap="round" />
          <circle cx={OX} cy={OY} r={5} fill="var(--ifm-font-color-base)" />
          <circle cx={px} cy={py} r={5} fill="var(--ifm-font-color-base)" />

          {/* barras: somando × de verdade */}
          {s3 > 0 && (
            <g>
              <rect x={BAR1} y={Y(sa)} width={BW} height={sa * R} fill="var(--mv-tone-1)" fillOpacity={0.35} stroke="var(--mv-tone-1)" strokeWidth={2} />
              <rect x={BAR1} y={Y(barTop1)} width={BW} height={sb * s3 * R} fill="var(--mv-tone-3)" fillOpacity={0.35} stroke="var(--mv-tone-3)" strokeWidth={2} />
              <rect x={BAR2} y={Y(sa)} width={BW} height={sa * R} fill="var(--mv-tone-1)" fillOpacity={0.35} stroke="var(--mv-tone-1)" strokeWidth={2} />
              <rect x={BAR2} y={Math.min(Y(sa), Y(barTop2))} width={BW} height={Math.abs(rise * s3) * R}
                fill="var(--mv-tone-2)" fillOpacity={0.35} stroke="var(--mv-tone-2)" strokeWidth={2} />
              {s3 > 0.95 && (
                <>
                  <SvgMath x={BAR1 + BW / 2} y={valueY(sa + sb)} math={val(sa + sb)} fontSize={12} halo />
                  <SvgMath x={BAR2 + BW / 2} y={valueY(Math.max(sab, sa))} math={mystery ? '?' : val(sab)} fontSize={12} halo />
                </>
              )}
            </g>
          )}
          <SvgMath x={BAR1 + BW / 2} y={OY + 16} math="\text{somando}" fontSize={12} />
          <SvgMath x={BAR2 + BW / 2} y={OY + 16} math="\text{de verdade}" fontSize={12} />
          <SvgMath x={BAR1 + BW / 2} y={OY + 36} math={sliders ? '\\sen a + \\sen b' : `${degA} \\text{ e } ${degB}`} fontSize={11} />
          <SvgMath x={BAR2 + BW / 2} y={OY + 36} math={sliders ? '\\sen(a + b)' : `${a + b}^\\circ`} fontSize={11} />
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'Azul: a altura depois do primeiro giro. Laranja: quanto o segundo giro sobe de verdade, começando de onde o primeiro parou. Verde: quanto o mesmo segundo giro subiria se começasse do zero. A barra "somando" junta azul e verde; a barra "de verdade" junta azul e laranja.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>{s2 > 0 ? 'Segundo giro: o braço continua de onde parou.' : 'Primeiro giro.'}</p>
        ) : (
          <>
            <p>
              Depois do primeiro giro, a altura é <Formula math={val(sa)} /> (azul). O segundo giro,
              começando dali, {rise >= -1e-9 ? 'sobe' : 'desce'} <Formula math={val(Math.abs(rise))} /> (laranja).
              Começando do zero, o mesmo giro subiria <Formula math={val(sb)} /> (verde).
            </p>
            <p>
              Somando: <Formula math={val(sa + sb)} />.{' '}
              {mystery ? 'De verdade: ?' : <>De verdade: <Formula math={val(sab)} />.</>}{' '}
              {sa + sb > 1 + 1e-9
                ? <>A soma passa {unit ? `do comprimento do braço (${num(length, 2).replace('{,}', ',')} ${unit})` : 'de 1'}, e nenhuma altura passa.</>
                : a === 0 || b === 0
                  ? 'Com um dos giros igual a zero, as duas barras coincidem.'
                  : 'As duas barras não coincidem.'}
            </p>
          </>
        )}
      </div>
      {sliders && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>Primeiro giro a: {a}°</span>
            <input type="range" min={0} max={90} step={5} value={a} disabled={playing}
              onChange={(e) => setA(Number(e.target.value))} aria-label="Primeiro giro a, em graus" />
          </label>
          <label className={shared.control}>
            <span>Segundo giro b: {b}°</span>
            <input type="range" min={0} max={90} step={5} value={b} disabled={playing}
              onChange={(e) => setB(Number(e.target.value))} aria-label="Segundo giro b, em graus" />
          </label>
        </div>
      )}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>Girar de novo</button>
      </div>
    </div>
  );
}
