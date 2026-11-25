import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// A mesma seta em lugares diferentes (lição 7.28, Vetores).
//
// Ao aparecer, a seta do vetor `vector` desliza, sem girar e sem esticar, por
// uma sequência de caudas (`tour`), deixando uma cópia cinza em cada parada.
// Depois, dois controles movem a cauda; a seta continua a mesma.
//
// readout="translate": diz onde está a cauda, onde está a ponta e quanto a
//   seta anda (o que não muda).
// readout="point": mostra também um ponto fixo P com os mesmos números do
//   vetor; a ponta só cai em P quando a cauda está na origem.
// readout="sum": escreve a chegada como saída mais vetor, A + v = B.

const tex = (n) => String(n);
const pair = (p) => `(${tex(p[0])},\\ ${tex(p[1])})`;
const sumTex = (n) => (n < 0 ? `(${n})` : String(n));

function horizontal(a) {
  if (a === 0) return 'não anda na horizontal';
  return `anda ${Math.abs(a)} para a ${a > 0 ? 'direita' : 'esquerda'}`;
}
function vertical(b) {
  if (b === 0) return 'não anda na vertical';
  return `${Math.abs(b)} para ${b > 0 ? 'cima' : 'baixo'}`;
}

export default function VectorSlide({
  vector = [3, 2],
  xMin = -1,
  xMax = 10,
  yMin = -1,
  yMax = 7,
  xUnit = 32,
  tour = [[0, 0], [5, 0], [1, 4], [6, 3]],
  point,
  readout = 'translate',
  vecLabel = '\\vec{v}',
  tailName,
  tipName,
  caption,
}) {
  const [a, b] = vector;
  const last = tour[tour.length - 1];
  const [tail, setTail] = useState(last);
  const legs = tour.length - 1;
  const duration = 0.5 + legs * 1.1;
  const {ref, t, play, playing} = useAnimation({duration});

  // Cauda durante a animação: anda de parada em parada.
  let shown = tail;
  let visited = tour.length;
  if (playing) {
    const s = Math.max(0, t - 0.5) / 1.1;
    const i = Math.min(legs - 1, Math.floor(s));
    const k = ease(Math.min(1, s - i));
    const p = tour[i];
    const q = tour[i + 1];
    shown = [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
    visited = Math.min(tour.length, i + (k >= 1 ? 2 : 1));
  }
  const tip = [shown[0] + a, shown[1] + b];

  const len = Math.hypot(a, b) || 1;
  const off = {dx: (-b / len) * 15, dy: (-a / len) * 15};

  const segments = [];
  tour.slice(0, visited).forEach((p) => {
    segments.push({from: p, to: [p[0] + a, p[1] + b], muted: true, arrow: true});
  });
  segments.push({from: shown, to: tip, tone: 1, arrow: true, label: vecLabel, ...off});

  const points = [{at: shown, tone: 1, r: 4}];
  if (point) points.unshift({at: point.at, tone: 2, r: 6, label: point.label, dx: point.dx ?? -8, dy: point.dy ?? -20});
  const labels = [];
  if (!playing && tailName) labels.push({at: shown, math: tailName, dx: -12, dy: 18, tone: 1});
  if (!playing && tipName) labels.push({at: tip, math: tipName, dx: 14, dy: -10, tone: 1});

  // Limites da cauda: a ponta precisa continuar dentro da janela.
  const tx = [Math.ceil(Math.max(xMin, xMin - a)), Math.floor(Math.min(xMax, xMax - a))];
  const ty = [Math.ceil(Math.max(yMin, yMin - b)), Math.floor(Math.min(yMax, yMax - b))];

  const onP = point && Math.abs(tip[0] - point.at[0]) < 1e-9 && Math.abs(tip[1] - point.at[1]) < 1e-9;

  return (
    <div className={shared.wrapper} data-explorer="vector-slide">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={caption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>A seta está deslizando. Ela não gira e não muda de tamanho.</p>
        ) : (
          <>
            <p>
              Cauda em <Formula math={pair(tail)} />, ponta em <Formula math={pair(tip)} />. Da cauda até a
              ponta, a seta {horizontal(a)} e {vertical(b)}: é sempre o vetor <Formula math={`${vecLabel} = ${pair(vector)}`} />.
            </p>
            {readout === 'sum' && (
              <p>
                Chegada = saída + vetor:{' '}
                <Formula
                  math={`${pair(tail)} + ${pair(vector)} = (${tex(tail[0])} + ${sumTex(a)},\\ ${tex(tail[1])} + ${sumTex(b)}) = ${pair(tip)}`}
                />
                .
              </p>
            )}
            {readout === 'point' && (
              <p>
                {onP ? (
                  <>
                    A cauda está na origem, e por isso a ponta caiu em cima do ponto <Formula math={point.label} />.
                  </>
                ) : (
                  <>
                    A ponta <strong>não</strong> está no ponto <Formula math={point.label} />. Ela só cai em cima dele quando a cauda está na origem.
                  </>
                )}
              </p>
            )}
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Cauda, coordenada x: {tail[0]}</span>
          <input
            type="range"
            min={tx[0]}
            max={tx[1]}
            step={1}
            value={tail[0]}
            disabled={playing}
            onChange={(e) => setTail([Number(e.target.value), tail[1]])}
            aria-label="Coordenada x da cauda da seta"
          />
        </label>
        <label className={shared.control}>
          <span>Cauda, coordenada y: {tail[1]}</span>
          <input
            type="range"
            min={ty[0]}
            max={ty[1]}
            step={1}
            value={tail[1]}
            disabled={playing}
            onChange={(e) => setTail([tail[0], Number(e.target.value)])}
            aria-label="Coordenada y da cauda da seta"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {point && (
          <button type="button" onClick={() => setTail([0, 0])} disabled={playing}>
            Cauda na origem
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setTail(last);
            play();
          }}
          disabled={playing}
        >
          Ver o deslize de novo
        </button>
      </div>
    </div>
  );
}
