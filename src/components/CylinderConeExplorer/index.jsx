import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';

// Cilindro com o cone de mesma base e mesma altura desenhado dentro dele.
// Dois deslizantes, raio e altura, em decímetros — assim o volume sai em dm³,
// que é litro, sem conversão nenhuma.
//
// É interativo porque mexer nos dois parâmetros É a ideia: dobrar a altura
// dobra o volume, dobrar o raio o quadruplica. O painel compara cada estado com
// o ponto de partida e escreve o fator do volume como (fator do raio)² ×
// (fator da altura), que é o r² da fórmula em ação. O cone acompanha sempre
// com um terço do cilindro.
//
// O desenho tem escala fixa (pixels por decímetro), ao contrário do
// SolidFigure, cujo viewBox acompanha as medidas: aqui o aluno precisa VER o
// cilindro engordar quando o raio cresce.

const R_MIN = 1;
const R_MAX = 4;
const H_MIN = 1;
const H_MAX = 8;
const STEP = 0.5;
const SCALE = 22;
const SQUASH = 0.3;
const VIEW_W = 320;
const VIEW_H = 310;
const CX = 150;
const BASE_Y = 250;

const text = (value, digits = 3) => mathNumber(value, digits).replace('{,}', ',');

export default function CylinderConeExplorer({initialRadius = 2, initialHeight = 4}) {
  const [r, setR] = useState(initialRadius);
  const [h, setH] = useState(initialHeight);

  const cylinder = Math.PI * r * r * h;
  const cone = cylinder / 3;
  const rFactor = r / initialRadius;
  const hFactor = h / initialHeight;
  const vFactor = rFactor * rFactor * hFactor;

  const rx = r * SCALE;
  const ry = rx * SQUASH;
  const topY = BASE_Y - h * SCALE;

  const reset = () => {
    setR(initialRadius);
    setH(initialHeight);
  };

  return (
    <div className={shared.wrapper} data-explorer="cylinder-cone">
      <figure className={styles.figure}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`Cilindro de raio ${text(r)} dm e altura ${text(h)} dm, com o cone de mesma base e mesma altura dentro dele.`}
        >
          <g style={{'--tone': 'var(--mv-tone-1)'}}>
            <path
              className={styles.face}
              d={`M ${CX - rx} ${topY} L ${CX - rx} ${BASE_Y} A ${rx} ${ry} 0 0 0 ${CX + rx} ${BASE_Y} L ${CX + rx} ${topY} Z`}
            />
            <ellipse className={styles.face} cx={CX} cy={topY} rx={rx} ry={ry} />
            <path
              className={styles.hidden}
              d={`M ${CX - rx} ${BASE_Y} A ${rx} ${ry} 0 0 1 ${CX + rx} ${BASE_Y}`}
            />
          </g>
          <g style={{'--tone': 'var(--mv-tone-2)'}}>
            <path
              className={styles.face}
              d={`M ${CX} ${topY} L ${CX - rx} ${BASE_Y} A ${rx} ${ry} 0 0 0 ${CX + rx} ${BASE_Y} Z`}
            />
          </g>
          <g style={{'--tone': 'var(--mv-tone-3)'}}>
            <line className={styles.measure} x1={CX} y1={BASE_Y} x2={CX + rx} y2={BASE_Y} />
            <line
              className={styles.measure}
              x1={CX + rx + 18}
              y1={topY}
              x2={CX + rx + 18}
              y2={BASE_Y}
            />
          </g>
          <SvgMath x={CX + rx / 2} y={BASE_Y + ry + 12} math="r" tone={3} halo />
          <SvgMath x={CX + rx + 34} y={(topY + BASE_Y) / 2} math="h" tone={3} halo />
        </svg>
        <figcaption className={shared.caption}>
          Cilindro (azul) com o cone de mesma base e mesma altura dentro dele
          (laranja). Medidas em decímetros.
        </figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula
            math={`V_{\\text{cilindro}} = \\pi \\times ${mathNumber(r)}^2 \\times ${mathNumber(h)} \\approx ${mathNumber(cylinder, 1)}\\ \\text{L}`}
          />
        </div>
        <div className={shared.formula}>
          <Formula
            math={`V_{\\text{cone}} = \\tfrac{1}{3} \\times ${mathNumber(cylinder, 1)} \\approx ${mathNumber(cone, 1)}\\ \\text{L}`}
          />
        </div>
        <p>Comparado ao ponto de partida ({text(initialRadius)} dm de raio e {text(initialHeight)} dm de altura):</p>
        <div className={shared.formula}>
          <Formula
            math={`\\text{fator do volume} = (\\underbrace{${mathNumber(rFactor)}}_{\\text{raio}})^2 \\times \\underbrace{${mathNumber(hFactor)}}_{\\text{altura}} = ${mathNumber(vFactor)}`}
          />
        </div>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Raio: {text(r)} dm</span>
          <input
            type="range"
            min={R_MIN}
            max={R_MAX}
            step={STEP}
            value={r}
            onChange={(event) => setR(Number(event.target.value))}
            aria-label="Raio da base, em decímetros"
          />
        </label>
        <label className={shared.control}>
          <span>Altura: {text(h)} dm</span>
          <input
            type="range"
            min={H_MIN}
            max={H_MAX}
            step={STEP}
            value={h}
            onChange={(event) => setH(Number(event.target.value))}
            aria-label="Altura, em decímetros"
          />
        </label>
        <div className={shared.buttons}>
          <button type="button" className={r * 2 > R_MAX ? styles.off : undefined} disabled={r * 2 > R_MAX} onClick={() => setR(r * 2)}>
            Dobrar o raio
          </button>
          <button type="button" className={h * 2 > H_MAX ? styles.off : undefined} disabled={h * 2 > H_MAX} onClick={() => setH(h * 2)}>
            Dobrar a altura
          </button>
          <button type="button" onClick={reset}>
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
