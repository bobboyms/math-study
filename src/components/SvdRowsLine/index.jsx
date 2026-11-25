import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, Dot, FixedGrid, Label, bmatrix, frame, num, numText, pair} from '../LinearGridMorph/plane';
import {svdN} from '../SvdCircleMorph/svd';

// A melhor camada de posto 1 como a reta que passa mais perto das linhas
// (lição 11.13).
//
// Cada linha da matriz é um ponto do plano (tom 2). O aluno gira, com o
// deslizante, a reta que passa pela origem na direção da seta x (tom 1, de
// comprimento 1). Cada ponto é projetado na reta (bolinha vazia), e o
// segmento verde é a distância do ponto até a reta. A soma dos quadrados
// dessas distâncias é o erro. Embaixo, o gráfico do erro para todas as
// direções de 0° a 180°, e o registro guarda o menor erro já visto. Quando o
// aluno chega à direção de v1 (a menos de 1°, um ímã puxa a seta), a reta fica
// verde e o registro diz que aquele é o mínimo.
//
// `mode="layer"` escreve a camada (Ax)xᵀ, cuja linha i é a projeção da
// linha i de A. `mode="pca"` fala em clientes e em quanto da variação a reta
// guarda.

const MAGNET = 1;
const wrap180 = (a) => ((a % 180) + 180) % 180;

export default function SvdRowsLine({
  rows = [
    [3, 0],
    [4, 5],
  ],
  name = 'A',
  mode = 'layer',
  pointLabels,
  window: win = [-1.5, 6.5, -1.5, 6.5],
  unit = 42,
  initial = 0,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const [deg, setDeg] = useState(initial);
  const [best, setBest] = useState(null);
  const sweepRef = useRef(false);

  const dec = svdN(rows);
  const v1 = dec.v[0];
  const v1deg = wrap180((Math.atan2(v1[1], v1[0]) * 180) / Math.PI);
  const total = rows.reduce((acc, r) => acc + r[0] * r[0] + r[1] * r[1], 0);
  const minErr = total - dec.s[0] * dec.s[0];

  const angleOf = (x) => {
    const dist = Math.min(Math.abs(x - v1deg), 180 - Math.abs(x - v1deg));
    return dist < MAGNET ? v1deg : x;
  };
  const errAt = (a) => {
    const r = (a * Math.PI) / 180;
    const x = [Math.cos(r), Math.sin(r)];
    return rows.reduce((acc, p) => {
      const c = p[0] * x[0] + p[1] * x[1];
      return acc + (p[0] * p[0] + p[1] * p[1] - c * c);
    }, 0);
  };
  const register = (x) => {
    const a = angleOf(x);
    const e = errAt(a);
    setBest((old) => (!old || e < old.e - 1e-12 ? {deg: a, e} : old));
  };

  const {ref, play, playing} = useAnimation({
    duration: 6,
    autoplay: false,
    onFrame: (tt, tot) => {
      if (!sweepRef.current) return;
      const x = Math.min(179, Math.round((tt / tot) * 180));
      setDeg(x);
      register(x);
      if (tt >= tot) {
        // Garante o registro de todas as direções, mesmo quando a animação
        // pula direto para o fim (menos movimento).
        for (let k = 0; k < 180; k += 1) register(k);
        sweepRef.current = false;
      }
    },
  });

  const angle = angleOf(deg);
  const rad = (angle * Math.PI) / 180;
  const x = [Math.cos(rad), Math.sin(rad)];
  const coef = rows.map((p) => p[0] * x[0] + p[1] * x[1]);
  const proj = coef.map((c) => [c * x[0], c * x[1]]);
  const err = errAt(angle);
  const atMin = Math.abs(err - minErr) < 1e-9;
  const found = best && Math.abs(best.e - minErr) < 1e-9;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const R = 30;
  const lineTone = atMin ? 'var(--mv-tone-3)' : 'var(--mv-tone-1)';

  // Gráfico do erro contra o ângulo da reta.
  const GW = f.W;
  const GH = 160;
  const gx0 = 48;
  const gx1 = GW - 16;
  const gy0 = 14;
  const gy1 = GH - 36;
  let maxE = 0;
  for (let i = 0; i <= 180; i += 1) maxE = Math.max(maxE, errAt(i));
  const top = maxE * 1.1 || 1;
  const GX = (a) => gx0 + ((gx1 - gx0) * a) / 180;
  const GY = (e) => gy1 - ((gy1 - gy0) * e) / top;
  let path = '';
  for (let i = 0; i <= 360; i += 1) path += `${i ? ' L' : 'M'} ${GX(i / 2).toFixed(1)} ${GY(errAt(i / 2)).toFixed(1)}`;
  const textColor = 'var(--ifm-color-emphasis-800)';
  const degText = (a) => `${numText(a, Math.abs(a - Math.round(a)) > 1e-6 ? 1 : 0)}°`;

  const layer = proj;

  return (
    <div className={shared.wrapper} data-explorer={`svd-rows-line-${mode}`}>
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="Os pontos, a reta pela origem e a distância de cada ponto até a reta">
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <Axes f={f} />
          <line
            x1={f.X(-R * x[0])}
            y1={f.Y(-R * x[1])}
            x2={f.X(R * x[0])}
            y2={f.Y(R * x[1])}
            stroke={lineTone}
            strokeWidth={atMin ? 2.4 : 1.8}
            strokeDasharray={atMin ? undefined : '8 5'}
            clipPath={`url(#${clipId})`}
          />
          {rows.map((p, i) => (
            <line
              key={`s${i}`}
              x1={f.X(p[0])}
              y1={f.Y(p[1])}
              x2={f.X(proj[i][0])}
              y2={f.Y(proj[i][1])}
              stroke="var(--mv-tone-3)"
              strokeWidth={2.6}
              clipPath={`url(#${clipId})`}
            />
          ))}
          <Arrow f={f} to={x} tone={1} label={playing ? null : '\\vec{x}'} offset={[-16 * x[1], -16 * x[0] + 4, 'middle']} />
          {proj.map((q, i) => (
            <Dot key={`q${i}`} f={f} at={q} tone={2} r={4} open />
          ))}
          {rows.map((p, i) => (
            <Dot key={`p${i}`} f={f} at={p} tone={2} r={5} />
          ))}
          {!playing &&
            (pointLabels ?? []).map((lb, i) =>
              lb ? <Label key={`l${i}`} f={f} at={rows[i]} math={lb.math} tone={2} dx={lb.dx ?? 10} dy={lb.dy ?? -8} anchor={lb.anchor ?? 'start'} /> : null,
            )}
        </svg>
        <svg className={styles.svg} viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label="Erro para cada direção da reta">
          <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          {[0, 45, 90, 135, 180].map((a) => (
            <text key={a} x={GX(a)} y={gy1 + 15} textAnchor="middle" fontSize={11} fill={textColor}>
              {a}°
            </text>
          ))}
          {gy1 - GY(minErr) > 12 && (
            <text x={gx0 - 6} y={gy1 + 4} textAnchor="end" fontSize={11} fill={textColor}>
              0
            </text>
          )}
          <line x1={gx0} y1={GY(minErr)} x2={gx1} y2={GY(minErr)} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="3 4" />
          <text x={gx0 - 6} y={GY(minErr) + 4} textAnchor="end" fontSize={11} fill={textColor}>
            {numText(minErr, Number.isInteger(Math.round(minErr * 1e6) / 1e6) ? 0 : 2)}
          </text>
          <text x={gx0 - 6} y={GY(maxE) + 4} textAnchor="end" fontSize={11} fill={textColor}>
            {numText(maxE, Number.isInteger(Math.round(maxE * 1e6) / 1e6) ? 0 : 2)}
          </text>
          <text x={(gx0 + gx1) / 2} y={GH - 4} textAnchor="middle" fontSize={11} fill={textColor}>
            ângulo da reta (a curva é a soma dos quadrados das distâncias)
          </text>
          <path d={path} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.8} />
          {found && <circle cx={GX(v1deg)} cy={GY(minErr)} r={5} fill="var(--mv-tone-3)" />}
          <line x1={GX(angle)} y1={gy0} x2={GX(angle)} y2={gy1} stroke="var(--mv-tone-1)" strokeWidth={1.2} strokeDasharray="3 3" />
          <circle cx={GX(angle)} cy={GY(err)} r={4.5} fill="var(--mv-tone-1)" />
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Ângulo da reta: <strong>{degText(angle)}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={179}
            step={1}
            value={deg}
            disabled={playing}
            onChange={(e) => {
              const v = Number(e.target.value);
              setDeg(v);
              register(v);
            }}
            aria-label="Ângulo da reta, em graus"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {mode === 'layer' ? (
          <>
            <p className={shared.formula}>
              <Formula math={`\\vec{x} = ${pair(x, 2)}, \\qquad (${name}\\vec{x})\\,\\vec{x}^{\\mathsf{T}} = ${bmatrix(layer, 2)}`} />
            </p>
            <p>
              Cada linha dessa camada é a projeção de uma linha de {name} na reta. Soma dos quadrados dos erros:{' '}
              <strong>{numText(err, 2)}</strong> = {numText(total, 0)} − {numText(total - err, 2)} (o total de {name} menos o quadrado do
              comprimento de {name}x).
            </p>
          </>
        ) : (
          <p>
            Soma dos quadrados das distâncias: <strong>{numText(err, 2)}</strong>. A reta guarda{' '}
            <strong>{numText((100 * (total - err)) / total, 1)}%</strong> da variação total ({numText(total, 0)}).
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
        <button type="button" disabled={playing || !best} onClick={() => setBest(null)}>
          Limpar o registro
        </button>
      </div>
      <p className={shared.hint}>
        {!best
          ? 'Registro: vazio. Gire a reta e procure o menor erro.'
          : `Registro: menor erro visto, ${numText(best.e, 2)} (reta a ${degText(best.deg)}).${
              found
                ? mode === 'layer'
                  ? ` É o mínimo: a reta está na direção de v₁, e o erro é σ₂² = ${numText(minErr, 2)}.`
                  : ' É o mínimo: a reta está na direção da primeira componente principal, v₁.'
                : ' Continue procurando.'
            }`}
      </p>
    </div>
  );
}
