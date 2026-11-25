import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {arcPath} from '../mathviz/useAnimation';
import {PI, TAU, angleRel, angleShort, valueTex, plain, mod2pi} from './angles';

// Uma volta do ciclo e a reta que procura as soluções de uma equação.
//
// - fn="sin": a reta horizontal y = c. Os pontos do círculo nessa altura são
//   os giros com seno c. Eles são espelhos um do outro no eixo vertical.
// - fn="cos": a reta vertical x = c. Os pontos do círculo nessa posição
//   horizontal são os giros com cosseno c, espelhados no eixo horizontal.
// - fn="tan": o ponto T = (1, c) na reta x = 1. A reta de O até T corta o
//   círculo em dois pontos opostos, separados por meia volta.
//
// O deslizante move c. Fora de [−1, 1] (seno e cosseno) a reta passa por fora
// do círculo e não há solução; em c = ±1 ela só encosta num ponto.

const W = 380;

const DEFAULT_PRESETS = {
  sin: [
    {label: '1/2', value: 0.5},
    {label: '√3/2', value: Math.sqrt(3) / 2},
    {label: '−1/2', value: -0.5},
    {label: '1', value: 1},
    {label: '1,3', value: 1.3},
  ],
  cos: [
    {label: '1/2', value: 0.5},
    {label: '−1/2', value: -0.5},
    {label: '√2/2', value: Math.SQRT2 / 2},
    {label: '−1', value: -1},
    {label: '−1,5', value: -1.5},
  ],
  tan: [
    {label: '1', value: 1},
    {label: '√3', value: Math.sqrt(3)},
    {label: '−1', value: -1},
    {label: '0', value: 0},
  ],
};

const NAMES = {sin: '\\sen', cos: '\\cos', tan: '\\tg'};

export default function TrigEqCycleLine({fn = 'sin', initial = 0.5, presets, caption}) {
  const [c, setC] = useState(initial);
  const isTan = fn === 'tan';
  const R = isTan ? 72 : 108;
  const span = isTan ? 2.35 : 1.5; // meia altura da janela, em raios
  const CX = W / 2 - 6;
  const CY = span * R + 14;
  const H = Math.ceil(2 * span * R + 28);
  const sx = (x) => CX + x * R;
  const sy = (y) => CY - y * R;
  const limit = isTan ? 2.2 : 1.5;

  // Soluções em [0, 2π), cada uma com o ângulo devolvido pela inversa (α)
  // ou com o espelho.
  let sols = [];
  let alpha = null;
  const outside = !isTan && Math.abs(c) > 1 + 1e-9;
  if (!outside) {
    const cc = Math.max(-1, Math.min(1, c));
    if (fn === 'sin') {
      alpha = Math.asin(cc);
      sols = [mod2pi(alpha), mod2pi(PI - alpha)];
    } else if (fn === 'cos') {
      alpha = Math.acos(cc);
      sols = [mod2pi(alpha), mod2pi(-alpha)];
    } else {
      alpha = Math.atan(c);
      sols = [mod2pi(alpha), mod2pi(alpha + PI)];
    }
    sols = sols.filter((x, i) => sols.findIndex((y) => Math.abs(y - x) < 1e-7) === i).sort((a, b) => a - b);
  }
  const touching = !isTan && !outside && sols.length === 1;
  const cTex = valueTex(c);
  const name = NAMES[fn];
  const argTex = c < 0 ? `\\left(${cTex}\\right)` : cTex;

  // Posição do rótulo de cada ponto: para fora do círculo, sem cair em cima
  // da reta que procura as soluções.
  const labelAt = (a) => {
    const px = Math.cos(a);
    const py = Math.sin(a);
    if (fn === 'sin') {
      const out = px >= 0 ? 1 : -1;
      return {x: sx(px) + out * 26, y: sy(py) + (c < 0 ? 15 : -15), anchor: out > 0 ? 'start' : 'end'};
    }
    if (fn === 'cos') {
      const right = c >= 0;
      return {x: sx(px) + (right ? 9 : -9), y: sy(py) + (py >= 0 ? -20 : 20), anchor: right ? 'start' : 'end'};
    }
    const b = a + 0.42;
    return {x: sx(1.3 * Math.cos(b)), y: sy(1.3 * Math.sin(b)), anchor: 'middle'};
  };

  let lineEl;
  if (fn === 'sin') {
    lineEl = <line x1={sx(-1.42)} y1={sy(c)} x2={sx(1.42)} y2={sy(c)} stroke="var(--mv-tone-1)" strokeWidth={2.25} />;
  } else if (fn === 'cos') {
    lineEl = <line x1={sx(c)} y1={sy(-1.42)} x2={sx(c)} y2={sy(1.42)} stroke="var(--mv-tone-1)" strokeWidth={2.25} />;
  } else {
    const a = Math.atan(c);
    const far = Math.min(1.25, Math.sqrt(1 + c * c));
    lineEl = (
      <g>
        <line x1={sx(1)} y1={sy(-span + 0.1)} x2={sx(1)} y2={sy(span - 0.1)} stroke="var(--mv-guide)" strokeWidth={1.5} />
        <SvgMath x={sx(1) + 6} y={sy(span - 0.25)} math="x = 1" anchor="start" fontSize={12} space={60} halo />
        <line x1={sx(-far * Math.cos(a))} y1={sy(-far * Math.sin(a))} x2={sx(1)} y2={sy(c)} stroke="var(--mv-tone-1)" strokeWidth={2.25} />
        <circle cx={sx(1)} cy={sy(c)} r={5} fill="var(--mv-tone-1)" stroke="var(--mv-paper)" strokeWidth={1.5} />
        <SvgMath x={sx(1) + 9} y={sy(c) + (c >= 0 ? -12 : 12)} math={`T = (1,\\ ${cTex})`} anchor="start" fontSize={12} tone={1} space={W - sx(1) - 10} halo />
      </g>
    );
  }

  // Espelho: eixo vertical (seno) ou horizontal (cosseno).
  const mirror = fn === 'sin'
    ? <line x1={sx(0)} y1={sy(1.3)} x2={sx(0)} y2={sy(-1.3)} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="6 5" />
    : fn === 'cos'
      ? <line x1={sx(-1.3)} y1={sy(0)} x2={sx(1.3)} y2={sy(0)} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="6 5" />
      : null;

  let text;
  if (outside) {
    const where = fn === 'sin' ? (c > 0 ? 'por cima' : 'por baixo') : c > 0 ? 'à direita' : 'à esquerda';
    const coord = fn === 'sin' ? 'altura' : 'posição horizontal';
    text = (
      <p>
        A reta passa {where} do círculo: <strong>nenhum ponto</strong>. Todo ponto do círculo de raio 1 tem{' '}
        {coord} entre −1 e 1, e {plain(c)} está fora dessa faixa. A equação{' '}
        <Formula math={`${name} x = ${cTex}`} /> não tem solução.
      </p>
    );
  } else if (touching) {
    text = (
      <p>
        A reta só encosta no círculo: <strong>um ponto por volta</strong>,{' '}
        <Formula math={`x ${angleRel(sols[0])}`} />. Os dois espelhos caíram no mesmo lugar.
      </p>
    );
  } else if (fn === 'sin') {
    const second = PI - alpha;
    text = (
      <>
        <p>
          <strong>Dois pontos</strong>, na mesma altura, espelhados no eixo vertical (tracejado verde). Em uma
          volta, de 0 a <Formula math="2\pi" />: <Formula math={`x ${angleRel(sols[0])}`} /> e{' '}
          <Formula math={`x ${angleRel(sols[1])}`} />.
        </p>
        <p>
          A calculadora dá <Formula math={`\\alpha = \\arcsen ${argTex} ${angleRel(alpha)}`} />. O espelho é{' '}
          <Formula math={`\\pi - \\alpha ${angleRel(second)}`} />
          {alpha < -1e-9 && (
            <>
              , e <Formula math="\alpha" /> com uma volta a mais é{' '}
              <Formula math={`\\alpha + 2\\pi ${angleRel(alpha + TAU)}`} />
            </>
          )}
          .
        </p>
      </>
    );
  } else if (fn === 'cos') {
    text = (
      <>
        <p>
          <strong>Dois pontos</strong>, na mesma posição horizontal, espelhados no eixo horizontal (tracejado
          verde). Em uma volta: <Formula math={`x ${angleRel(sols[0])}`} /> e{' '}
          <Formula math={`x ${angleRel(sols[1])}`} />.
        </p>
        <p>
          A calculadora dá <Formula math={`\\alpha = \\arccos ${argTex} ${angleRel(alpha)}`} />. O espelho é{' '}
          <Formula math={`-\\alpha`} />, que com uma volta a mais vira{' '}
          <Formula math={`2\\pi - \\alpha ${angleRel(TAU - alpha)}`} />.
        </p>
      </>
    );
  } else {
    text = (
      <>
        <p>
          A reta de O até T corta o círculo em <strong>dois pontos opostos</strong>, meia volta um do outro:{' '}
          <Formula math={`x ${angleRel(sols[0])}`} /> e <Formula math={`x ${angleRel(sols[1])}`} />.
        </p>
        <p>
          Os dois têm a mesma tangente, porque a tangente é a altura de T, e T é o mesmo para os dois. A
          calculadora dá <Formula math={`\\alpha = \\arctg ${argTex} ${angleRel(alpha)}`} />, e o outro é{' '}
          <Formula math={`\\alpha + \\pi`} />.
        </p>
      </>
    );
  }

  const defaultCaption = {
    sin: 'A reta horizontal y = c marca a altura procurada. Cada ponto em que ela corta o círculo é um giro com seno c.',
    cos: 'A reta vertical x = c marca a posição horizontal procurada. Cada ponto em que ela corta o círculo é um giro com cosseno c.',
    tan: 'T = (1, c) está na reta x = 1, na altura c. A reta de O até T corta o círculo nos giros com tangente c.',
  }[fn];

  const list = presets ?? DEFAULT_PRESETS[fn];
  const ariaSols = outside ? 'nenhum ponto' : sols.map((x) => plain(x)).join(' e ');

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-cycle-line">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Ciclo trigonométrico com a reta da equação ${fn} x = ${plain(c)}: ${ariaSols}.`}>
          {/* eixos */}
          <line x1={sx(-1.45)} y1={sy(0)} x2={sx(1.45)} y2={sy(0)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <line x1={sx(0)} y1={sy(Math.min(1.45, span))} x2={sx(0)} y2={sy(-Math.min(1.45, span))} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          {!outside && mirror}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />
          {lineEl}
          {/* raios e arcos de cada solução */}
          {sols.map((a, i) => {
            const [px, py] = [sx(Math.cos(a)), sy(Math.sin(a))];
            return (
              <g key={`r${i}`}>
                <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-2)" strokeWidth={1.5} />
                {a > 0.05 && <path d={arcPath(CX, CY, 16 + 11 * i, 0, a)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.5} />}
              </g>
            );
          })}
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />
          {sols.map((a, i) => {
            const L = labelAt(a);
            return (
              <g key={`p${i}`}>
                <circle cx={sx(Math.cos(a))} cy={sy(Math.sin(a))} r={6} fill="var(--mv-tone-2)" stroke="var(--mv-paper)" strokeWidth={1.75} />
                <SvgMath x={L.x} y={L.y} math={angleShort(a)} anchor={L.anchor} tone={2} fontSize={14} halo space={L.anchor === 'middle' ? 90 : 80} />
              </g>
            );
          })}
          {fn === 'sin' && (
            <SvgMath x={sx(-1.42)} y={sy(c) + (c > 1.2 ? 14 : -12)} math={`y = ${cTex}`} anchor="start" tone={1} fontSize={12} space={80} halo />
          )}
          {fn === 'cos' && (
            <SvgMath x={sx(c) + (c > 1.2 ? -6 : 6)} y={sy(-1.36)} math={`x = ${cTex}`} anchor={c > 1.2 ? 'end' : 'start'} tone={1} fontSize={12} space={80} halo />
          )}
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">{text}</div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Valor procurado: c = {plain(c)}
          </span>
          <input type="range" min={-limit} max={limit} step={0.05} value={c}
            onChange={(e) => setC(Number(e.target.value))}
            aria-label="Valor c procurado" aria-valuetext={`c igual a ${plain(c)}`} />
        </label>
      </div>
      <div className={shared.buttons}>
        {list.map((p) => (
          <button key={p.label} type="button" onClick={() => setC(p.value)} aria-pressed={Math.abs(c - p.value) < 1e-9}>
            c = {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
