import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage, arcPath} from '../mathviz/useAnimation';

// O caixote na rampa: o peso se reparte em duas componentes.
//
// A rampa tem a inclinação de verdade (sen θ = `sinValue`). A animação:
// 1. o peso P (verde) cresce do centro do caixote para baixo;
// 2. as duas componentes (laranja) crescem do mesmo ponto: uma desce ao longo
//    da rampa, a outra entra na rampa, perpendicular a ela;
// 3. as tracejadas fecham o retângulo: as duas componentes, somadas, refazem P.
//    O ângulo entre P e a componente perpendicular também é θ.
//
// Com `solved`, os rótulos trazem os valores, calculados com a relação
// fundamental (cos θ = √(1 − sen²θ)).

const W = 440;
const H = 340;
const TOP = 100; // o alto do desenho fica vazio: o viewBox começa aqui
const LX = 26;
const LY = 252;
const BASE = 384;
const ALONG = 232; // onde fica o caixote, medido ao longo da rampa
const BOX = 40;
const LP = 150; // comprimento da seta do peso
const DURATION = 4;

function head(x1, y1, x2, y2, size = 9) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * size;
  const by = y2 - uy * size;
  return `M ${x2} ${y2} L ${bx - uy * size * 0.5} ${by + ux * size * 0.5} L ${bx + uy * size * 0.5} ${by - ux * size * 0.5} Z`;
}

function Arrow({x1, y1, x2, y2, tone, width = 3}) {
  if (Math.hypot(x2 - x1, y2 - y1) < 3) return null;
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`var(--mv-tone-${tone})`} strokeWidth={width} strokeLinecap="round" />
      <path d={head(x1, y1, x2, y2)} fill={`var(--mv-tone-${tone})`} />
    </>
  );
}

export default function RampForces({
  weight = 80,
  sinValue = 0.28,
  unit = 'kgf',
  solved = false,
  caption,
}) {
  const {ref, t, play} = useAnimation({duration: DURATION});
  const kP = stage(t, 0.4, 1.4);
  const kC = stage(t, 1.6, 3.1);
  const kD = stage(t, 3.1, 3.6);

  const s = sinValue;
  const c = Math.sqrt(1 - s * s);
  // direção da rampa (subindo para a direita) e normal para fora (para cima)
  const ux = c;
  const uy = -s;
  const nx = -s;
  const ny = -c;
  const top = LY - BASE * (s / c);

  const bx = LX + ALONG * ux;
  const by = LY + ALONG * uy;
  const cx = bx + (BOX / 2) * nx;
  const cy = by + (BOX / 2) * ny;
  const corner = (a, b) => [bx + a * ux + b * nx, by + a * uy + b * ny];
  const boxPts = [corner(-BOX / 2, 0), corner(BOX / 2, 0), corner(BOX / 2, BOX), corner(-BOX / 2, BOX)];

  const pEnd = [cx, cy + LP * kP];
  const par = LP * s * kC;
  const perp = LP * c * kC;
  const parEnd = [cx - par * ux, cy - par * uy];
  const perpEnd = [cx - perp * nx, cy - perp * ny];
  const parFull = [cx - LP * s * ux, cy - LP * s * uy];
  const perpFull = [cx - LP * c * nx, cy - LP * c * ny];

  const fmt = (v) => mathNumber(v, 1);
  const unitTex = `\\ \\text{${unit}}`;
  const pLabel = solved ? `P = ${weight}${unitTex}` : 'P';
  const parLabel = solved ? `P\\sen\\theta = ${fmt(weight * s)}${unitTex}` : 'P\\sen\\theta';
  const perpLabel = solved ? `P\\cos\\theta = ${fmt(weight * c)}${unitTex}` : 'P\\cos\\theta = \\ ?';

  // ângulo θ entre P (para baixo) e a componente perpendicular
  const th = Math.asin(s);
  const angA = -Math.PI / 2;
  const angB = -Math.PI / 2 + th;

  const defaultCaption = solved
    ? `O peso de ${weight} ${unit} (verde) se reparte em ${fmt(weight * s).replace('{,}', ',')} ${unit} ao longo da rampa e ${fmt(weight * c).replace('{,}', ',')} ${unit} contra ela (laranja). As tracejadas fecham o retângulo: as duas componentes, somadas, refazem o peso.`
    : 'O peso P (verde) se reparte em duas componentes (laranja): P sen θ, que puxa o caixote rampa abaixo, e P cos θ, que aperta o caixote contra a rampa. As tracejadas mostram que as duas, somadas, refazem P.';

  return (
    <div className={shared.wrapper} data-explorer="ramp-forces">
      <figure ref={ref} className={geo.figure} style={{margin: 0}}>
        <svg className={geo.svg} viewBox={`0 ${TOP} ${W} ${H - TOP}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Caixote numa rampa. O peso aponta para baixo e se reparte numa componente ao longo da rampa e noutra perpendicular a ela.">
          {/* rampa */}
          <polygon points={`${LX},${LY} ${LX + BASE},${LY} ${LX + BASE},${top}`} fill="var(--mv-guide)" fillOpacity={0.18} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.75} strokeLinejoin="round" />
          <path d={arcPath(LX, LY, 62, 0, th)} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <SvgMath x={LX + 84 * Math.cos(th / 2)} y={LY - 84 * Math.sin(th / 2)} math="\theta" fontSize={14} />

          {/* sensor */}
          <SvgMath x={LX} y={TOP + 22} math={`\\text{sensor: } \\sen\\theta = ${mathNumber(s, 2)}`} anchor="start" fontSize={14} />

          {/* caixote */}
          <polygon points={boxPts.map((p) => p.join(',')).join(' ')} fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-800)" strokeWidth={1.75} strokeLinejoin="round" />

          {/* tracejadas que fecham o retângulo */}
          {kD > 0.02 && (
            <g opacity={kD}>
              <line x1={parFull[0]} y1={parFull[1]} x2={cx} y2={cy + LP} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} strokeDasharray="5 4" />
              <line x1={perpFull[0]} y1={perpFull[1]} x2={cx} y2={cy + LP} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} strokeDasharray="5 4" />
              <path d={arcPath(cx, cy, 86, angA, angB)} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={cx + 104 * Math.cos((angA + angB) / 2)} y={cy - 104 * Math.sin((angA + angB) / 2)} math="\theta" fontSize={13} halo />
            </g>
          )}

          <Arrow x1={cx} y1={cy} x2={pEnd[0]} y2={pEnd[1]} tone={3} width={3.5} />
          <Arrow x1={cx} y1={cy} x2={parEnd[0]} y2={parEnd[1]} tone={2} />
          <Arrow x1={cx} y1={cy} x2={perpEnd[0]} y2={perpEnd[1]} tone={2} />
          <circle cx={cx} cy={cy} r={3.5} fill="var(--ifm-font-color-base)" />

          {kP > 0.95 && <SvgMath x={cx - 12} y={cy + LP - 6} math={pLabel} anchor="end" tone={3} fontSize={14} halo />}
          {kD > 0.5 && (
            <>
              <SvgMath x={parFull[0] - 6} y={parFull[1] - 22} math={parLabel} anchor="end" tone={2} fontSize={13} halo />
              <SvgMath x={perpFull[0] + 10} y={perpFull[1] - 2} math={perpLabel} anchor="start" tone={2} fontSize={13} halo />
            </>
          )}
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Ver o peso se repartir de novo
        </button>
      </div>
    </div>
  );
}
