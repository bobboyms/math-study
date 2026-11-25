import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Substituição de trás para a frente (lição 11.4).
//
// As equações da forma escalonada ficam empilhadas, em escada. A animação
// resolve a de baixo, e o valor encontrado sobe por uma seta até a equação de
// cima, onde entra no lugar da letra. Cada quadro muda uma equação só, e a
// equação que acabou de mudar fica pintada. No quadro final, as três
// equações mostram a conta inteira, e o valor de cada incógnita aparece à
// direita.
//
// Props:
//   frames [{lines: [tex, ...], hl: índice da linha que mudou,
//            from: [índices das linhas de onde vêm os valores], note}]
//          O primeiro quadro é o sistema escalonado, sem nada resolvido.

const FRAME = 1.5;
const FADE = 0.5;
const RH = 46;
const TOP = 34;
const W = 440;
const X_EQ = 70;

export default function SystemBackSub({frames, caption}) {
  const F = frames.length;
  const duration = (F - 1) * FRAME + 0.6;
  const {ref, t, play, playing} = useAnimation({duration});
  const m = frames[0].lines.length;
  const H = TOP + (m - 1) * RH + 30;
  const rowY = (i) => TOP + i * RH;

  // quadro atual f e mistura com o anterior
  const f = Math.min(F - 1, Math.floor(t / FRAME));
  const local = t - f * FRAME;
  const mix = f === 0 ? 1 : stage(local, 0, FADE);
  const cur = frames[f];
  const prev = frames[Math.max(0, f - 1)];
  const arrowK = f === 0 ? 0 : stage(local, 0, FADE * 1.4);

  return (
    <div className={shared.wrapper} data-explorer="system-back-sub">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label="As equações em escada resolvidas de baixo para cima: o valor de cada incógnita sobe para a equação de cima."
        >
          {cur.hl !== undefined && f > 0 && (
            <rect
              x={X_EQ - 10}
              y={rowY(cur.hl) - RH / 2 + 5}
              width={W - X_EQ}
              height={RH - 10}
              rx={5}
              fill="var(--mv-tone-2)"
              fillOpacity={0.14 * mix}
              stroke="var(--mv-tone-2)"
              strokeOpacity={0.7 * mix}
              strokeWidth={1.5}
            />
          )}
          {(cur.from ?? []).map((src) => {
            if (f === 0 || cur.hl === undefined) return null;
            const y0 = rowY(src);
            const y1 = rowY(cur.hl);
            const x = 30 - (src - cur.hl - 1) * 12;
            return (
              <g key={src} opacity={arrowK} stroke="var(--mv-tone-3)" strokeWidth={1.8} fill="none">
                <path d={`M ${X_EQ - 14} ${y0} C ${x} ${y0}, ${x} ${y1}, ${X_EQ - 14} ${y1}`} />
                <path d={`M ${X_EQ - 21} ${y1 - 5} L ${X_EQ - 14} ${y1} L ${X_EQ - 21} ${y1 + 5}`} />
              </g>
            );
          })}
          {cur.lines.map((line, i) => {
            const old = prev.lines[i];
            if (old === line || f === 0) {
              return <SvgMath key={i} x={X_EQ} y={rowY(i)} math={`{${line}}`} anchor="start" space={W - X_EQ - 4} fontSize={16} />;
            }
            return (
              <g key={i}>
                <g opacity={1 - mix}>
                  <SvgMath x={X_EQ} y={rowY(i)} math={`{${old}}`} anchor="start" space={W - X_EQ - 4} fontSize={16} />
                </g>
                <g opacity={mix}>
                  <SvgMath x={X_EQ} y={rowY(i)} math={`{${line}}`} anchor="start" space={W - X_EQ - 4} fontSize={16} />
                </g>
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {cur.note && <p>{cur.note}</p>}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a subida de novo
        </button>
      </div>
    </div>
  );
}
