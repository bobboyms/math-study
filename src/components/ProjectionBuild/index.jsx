import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {clipLine, dot, kOf, lerp, norm, rightAngle, sub, times, num, pair, exact} from '../mathviz/projection';

// A sombra é tamanho vezes direção (lição 7.32).
//
// Animação em dois movimentos, os dois passos da fórmula:
// (1) uma cópia de u encolhe sobre a própria reta até medir 1: é o unitário
//     u / ‖u‖, que só diz para onde a sombra aponta;
// (2) o unitário estica pelo tamanho da sombra, (v · u) / ‖u‖, e a ponta para
//     exatamente no pé da linha que desce da ponta de v.
// O painel mostra as duas contas e como as duas divisões por ‖u‖ se juntam
// numa divisão por u · u.
//
// Com `error`, um botão mostra o erro de dividir só uma vez: multiplicar o
// próprio u (e não o unitário) pelo tamanho da sombra. A seta errada passa da
// ponta da sombra e fica mais comprida que a própria vara v.

const DURATION = 4.2;

const off = (d, L) => {
  const n = norm(d) || 1;
  return {dx: (d[0] / n) * L, dy: (-d[1] / n) * L};
};

export default function ProjectionBuild({u = [4, 2], v = [1, 4], error = false, box, unit = 52, caption}) {
  const [wrong, setWrong] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const lu = norm(u);
  const hat = times(1 / lu, u);
  const comp = dot(v, u) / lu;
  const k = kOf(v, u);
  const H = times(k, u);
  const W = times(comp, u); // o erro: tamanho da sombra vezes o próprio u

  const a = stage(t, 0.5, 1.8); // u encolhe até o unitário
  const b = stage(t, 2.2, 3.8); // o unitário estica até a sombra

  const pts = [[0, 0], u, v, H, ...(error ? [W] : [])];
  const B =
    box ??
    [
      Math.min(...pts.map((p) => p[0])) - 1,
      Math.max(...pts.map((p) => p[0])) + 1,
      Math.min(...pts.map((p) => p[1])) - 1,
      Math.max(...pts.map((p) => p[1])) + 1,
    ];

  const nrm = [-u[1], u[0]];
  const vSide = dot(v, nrm) >= 0 ? 1 : -1;
  const down = times(-vSide, nrm);

  const line = clipLine([0, 0], u, B);
  const segments = [];
  if (line) segments.push({from: line[0], to: line[1], muted: true, dashed: true});
  segments.push({from: [0, 0], to: u, tone: 1, arrow: true, dashed: a > 0.02 && b < 0.98});
  segments.push({from: [0, 0], to: v, tone: 2, arrow: true});
  segments.push({from: v, to: H, tone: 2, dashed: true});
  segments.push(...rightAngle(H, times(k >= 0 ? -1 : 1, u), sub(v, H), 0.24));

  const labels = [
    // Rótulo de u acima da ponta, do lado de v, longe o bastante para o halo não
    // cortar a sombra verde que passa por baixo.
    {at: u, math: '\\vec{u}', tone: 1, ...off([(0.4 * u[0]) / lu - down[0] / norm(down), (0.4 * u[1]) / lu - down[1] / norm(down)], 24)},
    {at: v, math: '\\vec{v}', tone: 2, ...off(v, 16)},
  ];

  // Seta que se transforma: u → unitário → sombra.
  let tip;
  if (b <= 0.001) tip = lerp(u, hat, a);
  else tip = lerp(hat, H, b);
  if (a > 0.02) {
    segments.push({from: [0, 0], to: tip, tone: 3, arrow: true});
  }
  if (a > 0.98 && b < 0.02) {
    // O rótulo vai um pouco adiante da ponta do unitário, para não encostar em
    // v, que sai da origem do mesmo lado.
    const lift = off(times(-1, down), 26);
    const ahead = off(u, 40);
    labels.push({at: hat, math: '\\text{unitário}', tone: 3, dx: lift.dx + ahead.dx, dy: lift.dy + ahead.dy});
  }
  if (b > 0.98) {
    // Com k maior que 1 a sombra passa da ponta de u, e o meio dela cairia junto
    // do rótulo de u: o nome da sombra vai para depois da ponta dela.
    if (k > 1) {
      const lift = off(times(-1, down), 18);
      labels.push({at: H, math: '\\operatorname{proj}_{\\vec{u}} \\vec{v}', tone: 3, anchor: 'start', dx: lift.dx + 10, dy: lift.dy});
    } else {
      labels.push({at: times(0.5, H), math: '\\operatorname{proj}_{\\vec{u}} \\vec{v}', tone: 3, ...off(times(-1, down), 24)});
    }
  }
  if (wrong && error && !playing) {
    segments.push({from: [0, 0], to: W, tone: 2, arrow: true});
    labels.push({at: W, math: pair(W, 2), tone: 2, ...off(down, 26)});
  }

  const eqH = exact(H[0], 2) && exact(H[1], 2);

  return (
    <div className={shared.wrapper} data-explorer="projection-build">
      <div ref={ref}>
        <CartesianPlane
          xMin={B[0]}
          xMax={B[1]}
          yMin={B[2]}
          yMax={B[3]}
          xUnit={unit}
          axisLabels={['x', 'y']}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'Primeiro, uma cópia de u encolhe sobre a própria reta até medir 1: é o unitário, que só diz a direção. Depois, o unitário estica pelo tamanho da sombra e para exatamente no pé da linha que desce da ponta de v.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\text{direção: } \\frac{\\vec{u}}{\\lVert \\vec{u} \\rVert} = \\frac{${pair(u, 2)}}{${exact(lu, 3) ? num(lu, 3) : `\\sqrt{${num(dot(u, u), 2)}}`}} ${exact(hat[0], 3) && exact(hat[1], 3) ? '=' : '\\approx'} ${pair(hat, 3)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{tamanho: } \\frac{\\vec{v} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert} = \\frac{${num(dot(v, u), 2)}}{${exact(lu, 3) ? num(lu, 3) : `\\sqrt{${num(dot(u, u), 2)}}`}} ${exact(comp, 3) ? '=' : '\\approx'} ${num(comp, 3)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{sombra: } ${num(comp, 3)} \\times ${pair(hat, 3)} ${eqH && exact(comp, 3) && exact(hat[0], 3) && exact(hat[1], 3) ? '=' : '\\approx'} ${pair(H, 2)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{numa conta só: } \\frac{\\vec{v} \\cdot \\vec{u}}{\\vec{u} \\cdot \\vec{u}}\\,\\vec{u} = \\frac{${num(dot(v, u), 2)}}{${num(dot(u, u), 2)}}\\,${pair(u, 2)} = ${num(k, 3)}\\,${pair(u, 2)} ${eqH ? '=' : '\\approx'} ${pair(H, 2)}`}
          />
        </p>
        {wrong && error && (
          <p>
            A seta laranja comprida é o erro: o tamanho da sombra, <Formula math={num(comp, 3)} />, multiplicado pelo
            próprio <Formula math="\vec{u}" />, que mede <Formula math={num(lu, 3)} /> e não 1. Ela mede{' '}
            <Formula math={num(norm(W), 2)} />, mais que a vara <Formula math={`\\lVert \\vec{v} \\rVert \\approx ${num(norm(v), 2)}`} />.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
        {error && (
          <button type="button" onClick={() => setWrong(!wrong)} disabled={playing} aria-pressed={wrong}>
            {wrong ? 'Esconder o erro' : 'Mostrar o erro: dividir só uma vez'}
          </button>
        )}
      </div>
    </div>
  );
}
