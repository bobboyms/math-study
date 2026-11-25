import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, Label, frame} from '../LinearGridMorph/plane';
import {apply, eigenvalues, eigenvector, lineEnds, niceDir, num, numText, offLine, pair, pairText} from '../EigenGridMorph/eigen';

// A busca das direções que a matriz não tira da reta (lição 11.11).
//
// O aluno gira a seta v (comprimento 1) com o deslizante de ângulo. A figura
// mostra a reta de v (tracejada), a seta Av e, embaixo, o desvio: o ângulo
// entre Av e a reta de v, para todos os ângulos de 0° a 180°. Quando o desvio
// zera, Av está na reta de v, e a direção vai para o registro com o fator λ.
//
// O deslizante anda de grau em grau. Uma direção especial que não cai num
// grau inteiro, como a de (1, −2), em 116,57°, puxa a seta quando ela passa a
// menos de 1° dela (um ímã), para o aluno conseguir parar exatamente nela.
// O botão "Varrer" gira a seta de 0° a 180° e registra o que encontrar.

const MAGNET = 1;

export default function EigenDirectionSearch({
  matrix = [
    [4, 1],
    [2, 3],
  ],
  name = 'B',
  initial = 0,
  window: win = [-4.8, 4.8, -4.2, 4.2],
  unit = 38,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const [deg, setDeg] = useState(initial);
  const [found, setFound] = useState([]);
  const sweepRef = useRef(false);

  // Direções especiais exatas (em graus, de 0 a 180).
  const special = eigenvalues(matrix).map((l) => {
    const v = eigenvector(matrix, l);
    let a = (Math.atan2(v[1], v[0]) * 180) / Math.PI;
    a = ((a % 180) + 180) % 180;
    return {deg: a, lambda: l, dir: niceDir(v) ?? v};
  });

  const snapped = (d) => {
    for (const sp of special) {
      const dist = Math.min(Math.abs(d - sp.deg), 180 - Math.abs(d - sp.deg));
      if (dist < MAGNET) return sp;
    }
    return null;
  };

  const register = (d) => {
    const sp = snapped(d);
    if (!sp) return;
    setFound((old) => (old.some((x) => Math.abs(x.deg - sp.deg) < 1e-6) ? old : [...old, sp].sort((a, b) => a.deg - b.deg)));
  };

  const {ref, play, playing} = useAnimation({
    duration: 6,
    autoplay: false,
    onFrame: (tt, total) => {
      if (!sweepRef.current) return;
      const d = Math.min(179, Math.round((tt / total) * 180));
      setDeg(d);
      register(d);
      if (tt >= total) sweepRef.current = false;
    },
  });

  const sp = snapped(deg);
  const angle = sp ? sp.deg : deg;
  const a = (angle * Math.PI) / 180;
  const v = [Math.cos(a), Math.sin(a)];
  const w = apply(matrix, v);
  const dev = sp ? 0 : offLine(v, w);
  const onLine = Math.abs(dev) < 1e-6;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const [la, lb] = lineEnds(v, win);
  const pa = f.P(la);
  const pb = f.P(lb);

  // Elipse: para onde vão todas as setas de comprimento 1.
  const ell = [];
  for (let i = 0; i <= 96; i += 1) {
    const th = (i / 96) * 2 * Math.PI;
    ell.push(f.P(apply(matrix, [Math.cos(th), Math.sin(th)])));
  }
  const ellPath = `M ${ell.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} Z`;

  // Gráfico do desvio
  const GW = f.W;
  const GH = 150;
  const gx0 = 46;
  const gx1 = GW - 16;
  const gy0 = 18;
  const gy1 = GH - 34;
  const GX = (d) => gx0 + ((gx1 - gx0) * d) / 180;
  const GY = (e) => gy0 + ((gy1 - gy0) * (90 - e)) / 180;
  const curve = [];
  let prev = null;
  let path = '';
  for (let i = 0; i <= 360; i += 1) {
    const d = i / 2;
    const r = (d * Math.PI) / 180;
    const vv = [Math.cos(r), Math.sin(r)];
    const e = offLine(vv, apply(matrix, vv));
    // não liga os pontos quando o desvio salta de +90 para −90
    if (prev !== null && Math.abs(e - prev) > 60) path += ` M ${GX(d).toFixed(1)} ${GY(e).toFixed(1)}`;
    else path += `${path ? ' L' : 'M'} ${GX(d).toFixed(1)} ${GY(e).toFixed(1)}`;
    prev = e;
  }
  curve.push(path);

  const lab = sp ? `${name}\\vec{v} = ${num(sp.lambda, 2)}\\vec{v}` : `${name}\\vec{v}`;

  return (
    <div className={shared.wrapper} data-explorer="eigen-direction-search">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={`A seta v, a sua reta e a seta ${name}v`}>
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <Axes f={f} />
          <path d={ellPath} fill="none" stroke="var(--mv-guide)" strokeWidth={1.3} strokeDasharray="4 4" />
          <circle cx={f.X(0)} cy={f.Y(0)} r={unit} fill="none" stroke="var(--mv-guide)" strokeWidth={1.3} />
          <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} stroke="var(--mv-tone-1)" strokeWidth={1.8} strokeDasharray="7 5" clipPath={`url(#${clipId})`} />
          {found.map((x) => {
            const [qa, qb] = lineEnds(x.dir, win);
            const p1 = f.P(qa);
            const p2 = f.P(qb);
            return <line key={x.deg} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="var(--mv-tone-3)" strokeWidth={1.4} opacity={0.7} clipPath={`url(#${clipId})`} />;
          })}
          <Arrow f={f} to={w} tone={onLine ? 3 : 2} label={playing ? null : lab} offset={w[1] < -0.3 ? [10, 16, 'start'] : undefined} />
          <Arrow f={f} to={v} tone={1} label={playing ? null : '\\vec{v}'} offset={[v[0] >= 0 ? -6 : 6, v[1] >= 0 ? -14 : 14, v[0] >= 0 ? 'end' : 'start']} />
        </svg>
        <svg className={styles.svg} viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label="Desvio entre a reta de v e a seta Bv, para cada ângulo">
          <line x1={gx0} y1={GY(0)} x2={gx1} y2={GY(0)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          {[0, 45, 90, 135, 180].map((d) => (
            <text key={d} x={GX(d)} y={gy1 + 16} textAnchor="middle" fontSize={11} fill="var(--ifm-color-emphasis-800)">
              {d}°
            </text>
          ))}
          {[-90, 90].map((e) => (
            <text key={e} x={gx0 - 6} y={GY(e) + 4} textAnchor="end" fontSize={11} fill="var(--ifm-color-emphasis-800)">
              {e > 0 ? '90°' : '−90°'}
            </text>
          ))}
          <text x={gx0 - 6} y={GY(0) + 4} textAnchor="end" fontSize={11} fill="var(--ifm-color-emphasis-800)">
            0°
          </text>
          <text x={(gx0 + gx1) / 2} y={GH - 2} textAnchor="middle" fontSize={11} fill="var(--ifm-color-emphasis-800)">
            ângulo da seta v
          </text>
          <path d={curve[0]} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.8} />
          {found.map((x) => (
            <circle key={x.deg} cx={GX(x.deg)} cy={GY(0)} r={5} fill="var(--mv-tone-3)" />
          ))}
          <line x1={GX(angle)} y1={gy0} x2={GX(angle)} y2={gy1} stroke="var(--mv-tone-1)" strokeWidth={1.2} strokeDasharray="3 3" />
          <circle cx={GX(angle)} cy={GY(dev)} r={4.5} fill="var(--mv-tone-1)" />
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Ângulo da seta v: <strong>{numText(angle, sp && Math.abs(sp.deg - Math.round(sp.deg)) > 1e-6 ? 2 : 0)}°</strong>
          </span>
          <input
            type="range"
            min={0}
            max={179}
            step={1}
            value={deg}
            disabled={playing}
            onChange={(e) => {
              const d = Number(e.target.value);
              setDeg(d);
              register(d);
            }}
            aria-label="Ângulo da seta v, em graus"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\vec{v} = ${sp ? `\\text{direção de } ${pair(sp.dir, 0)}` : pair(v, 2)}, \\qquad ${name}\\vec{v} = ${pair(w, 2)}`} />
        </p>
        {onLine ? (
          <p>
            <strong>{name}v ficou na reta de v.</strong> A seta foi multiplicada por {numText(sp.lambda, 2)}: {name}v ={' '}
            {numText(sp.lambda, 2)}v. Esta é uma direção especial de {name}, a reta de {pairText(sp.dir, 0)}.
          </p>
        ) : (
          <p>
            {name}v saiu da reta de v: o ângulo entre a reta de v e {name}v é de {numText(Math.abs(dev), 1)}°. A matriz girou a seta, além de
            esticá-la.
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
        <button type="button" disabled={playing || !found.length} onClick={() => setFound([])}>
          Limpar o registro
        </button>
      </div>
      <p className={shared.hint}>
        {found.length === 0
          ? 'Registro: nenhuma direção especial encontrada ainda. Gire a seta e procure os ângulos em que o desvio, no gráfico de baixo, chega a zero.'
          : `Registro: ${found
              .map((x) => `reta de ${pairText(x.dir, 0)}, com ${name}v = ${numText(x.lambda, 2)}v (${numText(x.deg, 2)}°)`)
              .join('; ')}.${found.length < special.length ? ' Falta pelo menos uma.' : ' Não há outras: em todos os outros ângulos o desvio não é zero.'}`}
      </p>
    </div>
  );
}

