import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {makeFrame} from '../WaveTracer/frame';
import {curvePath, num, TAU} from '../WaveTracer/wave';

// Uma reta horizontal y = c sobre o gráfico do seno (ou do cosseno), numa
// janela de 1, 2 ou 3 voltas. Os pontos de encontro são as soluções de
// sen x = c na janela, calculados pela fórmula (não por amostragem), e o
// painel conta quantos são. Fora de [−1, 1] não há encontro nenhum.

const WIDTH = 560;

function solutions(fn, c, xMax) {
  if (Math.abs(c) > 1 + 1e-12) return [];
  const cc = Math.max(-1, Math.min(1, c));
  const base = fn === 'sin'
    ? [Math.asin(cc), Math.PI - Math.asin(cc)]
    : [Math.acos(cc), -Math.acos(cc)];
  const out = [];
  for (let k = -1; k <= Math.ceil(xMax / TAU) + 1; k += 1) {
    base.forEach((b) => {
      const x = b + k * TAU;
      if (x >= -1e-9 && x <= xMax + 1e-9 && !out.some((o) => Math.abs(o - x) < 1e-7)) out.push(Math.max(0, x));
    });
  }
  return out.sort((a, b) => a - b);
}

export default function WaveLevelCounter({fn = 'sin', initialC = 0.4, initialTurns = 2, caption}) {
  const [c100, setC100] = useState(Math.round(initialC * 100));
  const [turns, setTurns] = useState(initialTurns);
  const c = c100 / 100;
  const f = fn === 'sin' ? Math.sin : Math.cos;
  const tone = fn === 'sin' ? 2 : 3;
  const name = fn === 'sin' ? '\\sen' : '\\cos';
  const xMax = turns * TAU;
  const G = WIDTH / (xMax + 0.4);
  const fr = makeFrame({xMin: -0.2, xMax: xMax + 0.2, yMin: -1.6, yMax: 1.6, G, K: 56, tickEvery: turns === 1 ? 1 : 2, yName: `${name} x`});
  const {gx, gy, W, H} = fr;
  const sols = solutions(fn, c, xMax);
  const n = sols.length;
  const intervalTex = `[0,\\ ${2 * turns}\\pi]`;

  let text;
  if (Math.abs(c) > 1) {
    text = (
      <p>
        A reta passa {c > 0 ? 'acima' : 'abaixo'} da curva inteira: <strong>nenhum ponto de encontro</strong>. A
        equação <Formula math={`${name} x = ${num(c, 2)}`} /> não tem solução, porque{' '}
        <Formula math={num(c, 2)} /> está fora da imagem <Formula math="[-1,\ 1]" />.
      </p>
    );
  } else {
    const perTurn = Math.abs(Math.abs(c) - 1) < 1e-9
      ? 'A reta só encosta na curva, num pico ou num vale: um ponto por volta.'
      : 'Em cada volta a curva passa por essa altura duas vezes: uma subindo, outra descendo.';
    text = (
      <>
        <p>
          <strong>{n} {n === 1 ? 'ponto' : 'pontos'} de encontro</strong>: a equação{' '}
          <Formula math={`${name} x = ${num(c, 2)}`} /> tem {n} {n === 1 ? 'solução' : 'soluções'} em{' '}
          <Formula math={intervalTex} />. {perTurn}
          {fn === 'sin' && Math.abs(c) < 1e-9 && ' Com c = 0, as duas pontas da janela também contam.'}
          {fn === 'cos' && Math.abs(c - 1) < 1e-9 && ' As duas pontas da janela também contam.'}
        </p>
        <p>
          <Formula math={`x \\approx ${sols.map((x) => num(x, 2)).join(';\\ ')}`} />
        </p>
      </>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="wave-level-counter">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Reta y = ${num(c, 2)} sobre o gráfico: ${n} pontos de encontro.`}>
          {fr.axes}
          <path d={curvePath(f, -0.2, xMax + 0.2, gx, gy)} fill="none" stroke={`var(--mv-tone-${tone})`} strokeWidth={2.5} />
          <line x1={gx(-0.2)} y1={gy(c)} x2={gx(xMax + 0.2)} y2={gy(c)} stroke="var(--mv-tone-1)" strokeWidth={2} />
          {sols.map((x) => (
            <g key={x}>
              <line x1={gx(x)} y1={gy(c)} x2={gx(x)} y2={gy(0)} stroke="var(--mv-tone-1)" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={gx(x)} cy={gy(c)} r={5} fill="var(--mv-tone-1)" stroke="var(--mv-paper)" strokeWidth={1.5} />
            </g>
          ))}
          <line x1={gx(xMax)} y1={gy(1.5)} x2={gx(xMax)} y2={gy(-1.5)} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="4 4" />
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'Arraste a reta horizontal y = c. Cada ponto de encontro com a curva é um x com a altura c: uma solução da equação.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">{text}</div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Altura da reta: c = {num(c, 2).replace('{,}', ',')}</span>
          <input type="range" min={-150} max={150} step={5} value={c100}
            onChange={(e) => setC100(Number(e.target.value))}
            aria-label="Altura c da reta horizontal" aria-valuetext={`c igual a ${num(c, 2).replace('{,}', ',')}`} />
        </label>
      </div>
      <div className={shared.buttons}>
        {[1, 2, 3].map((k) => (
          <button key={k} type="button" onClick={() => setTurns(k)} aria-pressed={turns === k}>
            {k === 1 ? 'Janela de 1 volta' : `Janela de ${k} voltas`}
          </button>
        ))}
      </div>
    </div>
  );
}
