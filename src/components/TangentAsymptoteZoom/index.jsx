import React, {useRef, useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// Chegar perto de π/2 pelos dois lados.
//
// O aluno escolhe a distância d até 90° (10°, 1°, 0,1° ou 0,01°). O gráfico
// mostra o ponto a d antes de 90° (tangente positiva) e o ponto a d depois
// (tangente negativa), e a janela vertical se ajusta para caber os dois. A
// cada botão, a janela se afasta: os pontos encostam cada vez mais na
// assíntota, a escala vertical cresce dez vezes, e a curva continua saindo
// pelo alto. A tabela do painel registra as quatro distâncias.
//
// A curva é cortada um pouco além da janela (e não amostrada em pontos que
// estouram), para que o traço suba até a borda do desenho mesmo quando a
// amostragem de 1 pixel não chega perto o bastante da assíntota.

const HALF = Math.PI / 2;
const STEPS = [
  {d: 10, text: '10°', before: '80^\\circ', after: '100^\\circ'},
  {d: 1, text: '1°', before: '89^\\circ', after: '91^\\circ'},
  {d: 0.1, text: '0,1°', before: '89{,}9^\\circ', after: '90{,}1^\\circ'},
  {d: 0.01, text: '0,01°', before: '89{,}99^\\circ', after: '90{,}01^\\circ'},
];
const PLOT_H = 300;
const DURATION = 1.4;

const tgNear = (d) => Math.tan(HALF - (d * Math.PI) / 180);

// Passo da malha: 1, 2 ou 5 vezes uma potência de 10, com no máximo 5 linhas
// acima do eixo.
function niceStep(yMax) {
  const p = 10 ** Math.floor(Math.log10(yMax));
  for (const m of [0.2, 0.5, 1, 2, 5, 10]) {
    if (yMax / (m * p) <= 5) return m * p;
  }
  return 10 * p;
}

export default function TangentAsymptoteZoom({initial = 0, caption}) {
  const [index, setIndex] = useState(initial);
  const origin = useRef(initial);
  const {t, play, playing} = useAnimation({duration: DURATION, autoplay: false});

  const go = (i) => {
    if (i === index) return;
    origin.current = index;
    setIndex(i);
    play();
  };

  // Distância mostrada: interpolada em escala logarítmica durante o zoom.
  const k = playing ? ease(t / DURATION) : 1;
  const d0 = STEPS[origin.current].d;
  const d1 = STEPS[index].d;
  const d = d0 * (d1 / d0) ** k;
  const value = tgNear(d);
  const yMax = value * 1.25;
  const yStep = niceStep(yMax);
  const xd = (d * Math.PI) / 180;
  const clampF = (x) => Math.max(-yMax - 1.9, Math.min(yMax + 1.9, Math.tan(x)));

  const step = STEPS[index];
  const settled = !playing;

  return (
    <div className={shared.wrapper} data-explorer="tangent-asymptote-zoom">
      <CartesianPlane
        xMin={1.0}
        xMax={2.15}
        yMin={-yMax}
        yMax={yMax}
        xUnit={300}
        yUnit={PLOT_H / (2 * yMax)}
        xStep={0.2}
        yStep={yStep}
        xTicks={[
          {at: 1.2},
          {at: 1.4},
          {at: HALF, label: '\\frac{\\pi}{2}'},
          {at: 1.8},
          {at: 2.0},
        ]}
        functions={[{f: clampF, tone: 1}]}
        lines={[{x: HALF, dashed: true, muted: true}]}
        points={[
          {at: [HALF - xd, value], tone: 2, label: settled ? step.before : null, dx: -34, dy: 0},
          {at: [HALF + xd, -value], tone: 2, label: settled ? step.after : null, dx: 36, dy: 0},
        ]}
        caption={
          caption ??
          'Os dois pontos estão à mesma distância de π/2, um antes e um depois. A cada botão, a escala vertical se ajusta para que eles caibam no desenho.'
        }
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          A {step.text} de 90°: <Formula math={`\\tg ${step.before} \\approx ${mathNumber(tgNear(step.d), 2)}`} /> e{' '}
          <Formula math={`\\tg ${step.after} \\approx ${mathNumber(-tgNear(step.d), 2)}`} />. Repare na escala do
          eixo vertical: cada linha da malha vale {mathNumber(niceStep(tgNear(step.d) * 1.25), 1).replace('{,}', ',')}.
        </p>
        <table>
          <thead>
            <tr>
              <th>distância até 90°</th>
              <th>antes de 90°</th>
              <th>depois de 90°</th>
            </tr>
          </thead>
          <tbody>
            {STEPS.map((s, i) => (
              <tr key={s.text} style={i === index ? {fontWeight: 700} : undefined}>
                <td>{s.text}</td>
                <td>
                  <Formula math={`${mathNumber(tgNear(s.d), 2)}`} />
                </td>
                <td>
                  <Formula math={`${mathNumber(-tgNear(s.d), 2)}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={shared.buttons}>
        {STEPS.map((s, i) => (
          <button key={s.text} type="button" onClick={() => go(i)} disabled={playing} aria-pressed={i === index}>
            a {s.text} de 90°
          </button>
        ))}
      </div>
    </div>
  );
}
