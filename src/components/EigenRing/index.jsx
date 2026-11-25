import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, FixedGrid, frame} from '../LinearGridMorph/plane';
import {apply, bmatrix, det, num, numText, offLine, rotation, trace} from '../EigenGridMorph/eigen';

// Uma roda de setas e as suas imagens (lição 11.11): quais direções ficam na
// própria reta?
//
// kind="rotation": a rotação de θ graus (deslizante de 0° a 180°). Entre 0° e
// 180°, nenhuma seta fica na sua reta, e o discriminante da equação
// característica, (2 cos θ)² − 4, é negativo. Em 0° todas ficam (fator 1), e
// em 180° todas ficam viradas (fator −1).
//
// kind="shear": o cisalhamento [[1, k], [0, 1]] (deslizante de k). Só as setas
// deitadas, no eixo x, ficam na reta delas: uma direção só.
//
// As setas originais ficam claras; as imagens saem em laranja quando mudaram
// de reta e em verde quando ficaram na mesma reta. Ao entrar na tela, o
// parâmetro anda de 0 até o valor inicial.

const N = 10; // de 36° em 36°: um giro de 90° não leva uma seta em cima de outra

export default function EigenRing({kind = 'rotation', initial, caption}) {
  const rot = kind === 'rotation';
  const cfg = rot ? {min: 0, max: 180, step: 5, init: initial ?? 90} : {min: -2, max: 2, step: 0.25, init: initial ?? 1};
  const [val, setVal] = useState(cfg.init);
  const [manual, setManual] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: 3, onFrame: () => setManual(false)});

  const p = manual ? val : cfg.init * stage(t, 0.2, 2.8);
  const shown = playing ? p : manual ? val : cfg.init;
  const M = rot
    ? rotation(shown)
    : [
        [1, shown],
        [0, 1],
      ];
  const exactM = rot ? rotation(shown) : M;

  const win = [-2.3, 2.3, -2.3, 2.3];
  const f = frame(win, 56);

  const arrows = [];
  let stay = 0;
  for (let i = 0; i < N; i += 1) {
    const a = (i * 2 * Math.PI) / N;
    const v = [1.6 * Math.cos(a), 1.6 * Math.sin(a)];
    const w = apply(exactM, v);
    const keep = Math.abs(offLine(v, w)) < 0.05;
    if (keep) stay += 1;
    arrows.push({v, w, keep});
  }

  const tr = trace(exactM);
  const dt = det(exactM);
  const disc = tr * tr - 4 * dt;
  const discR = Math.abs(disc) < 1e-9 ? 0 : disc;
  const name = rot ? 'R' : 'C';

  let status;
  if (rot) {
    if (shown < 1e-9) status = 'Giro de 0°: nada se move, e todas as setas ficam na sua reta (fator 1).';
    else if (Math.abs(shown - 180) < 1e-9) status = 'Giro de 180°: toda seta fica na sua reta, virada para o lado oposto (fator −1).';
    else status = `Giro de ${numText(shown, 0)}°: nenhuma das ${N} setas ficou na sua reta. Toda seta foi girada, e nenhuma direção é especial.`;
  } else if (Math.abs(shown) < 1e-9) status = 'Com k = 0 nada se move, e todas as setas ficam na sua reta.';
  else status = `Só ${stay === 2 ? 'as duas setas deitadas' : `${stay} setas`}, no eixo x, ficaram na sua reta (fator 1). Todas as outras foram inclinadas: o cisalhamento tem uma direção especial só.`;

  return (
    <div className={shared.wrapper} data-explorer="eigen-ring">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="Dez setas e as suas imagens">
          <FixedGrid f={f} />
          <Axes f={f} />
          {arrows.map((x, i) => (
            <Arrow key={`o${i}`} f={f} to={x.v} tone={0} opacity={0.35} width={2} head={8} />
          ))}
          {arrows.map((x, i) => (
            <Arrow key={`i${i}`} f={f} to={x.w} tone={x.keep && !playing ? 3 : 2} width={2.4} head={9} />
          ))}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            {rot ? 'Ângulo do giro θ' : 'Inclinação k do cisalhamento'}: <strong>{numText(shown, rot ? 0 : 2)}{rot ? '°' : ''}</strong>
          </span>
          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={manual ? val : cfg.init}
            disabled={playing}
            onChange={(e) => {
              setVal(Number(e.target.value));
              setManual(true);
            }}
            aria-label={rot ? 'Ângulo do giro, em graus' : 'Inclinação k do cisalhamento'}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`${name} = ${bmatrix(exactM, 2)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{traço} = ${num(tr, 2)}, \\quad \\det ${name} = ${num(dt, 2)}, \\quad \\Delta = ${tr < -1e-9 ? `(${num(tr, 2)})` : num(tr, 2)}^2 - 4 \\times ${num(dt, 2)} ${Math.abs(tr * 100 - Math.round(tr * 100)) < 1e-6 ? '=' : '\\approx'} ${num(discR, 2)}`}
          />
        </p>
        <p>{status}</p>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setManual(false);
            play();
          }}
        >
          Ver o movimento de novo
        </button>
      </div>
    </div>
  );
}
