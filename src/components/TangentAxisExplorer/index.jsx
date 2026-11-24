import React, {useState} from 'react';
import UnitCircle from '../UnitCircle';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// A tangente lida no eixo x = 1, com um deslizante para o giro.
//
// O raio do giro é prolongado (para a frente ou para trás, pelo centro) até
// cortar a reta vertical x = 1, no ponto T. A altura de T é a tangente. O
// aluno arrasta o giro e vê T subir sem limite perto de 90°, sumir em 90°
// (raio paralelo à reta) e voltar ao mesmo lugar meia volta depois.
//
// O desenho corta T em `clamp`; acima disso, o painel avisa que T saiu da
// figura e dá o valor. Na primeira vez que aparece, o giro anda de 0 até
// `initial`.

const CLAMP = 1.8;

export default function TangentAxisExplorer({
  initial = 80,
  from = 0,
  duration = 3,
  presets = [45, 80, 85, 90, 135, 225],
  caption = 'A reta do raio, prolongada, corta a reta x = 1 no ponto T. A altura de T (segmento destacado) é a tangente do giro.',
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration});
  const shown = playing ? Math.round(from + ease(t / duration) * (deg - from)) : deg;

  const th = (shown * Math.PI) / 180;
  const vertical = ((shown % 180) + 180) % 180 === 90;
  const tg = Math.tan(th);
  const outside = !vertical && Math.abs(tg) > CLAMP;
  const rel = Math.abs(tg - Number(tg.toFixed(3))) < 1e-9 ? '=' : '\\approx';

  return (
    <div className={shared.wrapper} data-explorer="tangent-axis">
      <div ref={ref}>
        <UnitCircle
          scale={92}
          padding={40}
          showTangent
          tangentClamp={CLAMP}
          angles={[{
            deg: shown,
            label: shown >= 15 ? '\\theta' : null,
            showTangentSegment: !vertical,
            tangentLabel: !vertical && !outside ? 'T' : null,
            tone: 1,
          }]}
          caption={caption}
        />
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {vertical ? (
          <p>
            Em <strong>{shown}°</strong> o raio fica em pé, paralelo à reta x = 1. A reta do raio e a
            reta x = 1 nunca se cruzam: não há ponto T, e <Formula math={`\\tg ${shown}^\\circ`} /> não existe.
          </p>
        ) : (
          <p>
            <Formula math={`\\tg ${shown}^\\circ ${rel} ${mathNumber(Math.abs(tg) < 1e-9 ? 0 : tg, 2)}`} />.{' '}
            {outside
              ? `T está ${tg > 0 ? 'acima' : 'abaixo'} da parte desenhada da reta: quanto mais o raio se aproxima de ficar em pé, mais longe o ponto T vai.`
              : tg > 1e-9
                ? 'T está acima do eixo horizontal: tangente positiva.'
                : tg < -1e-9
                  ? 'T está abaixo do eixo horizontal: tangente negativa.'
                  : 'T está sobre o eixo horizontal: tangente zero.'}
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro θ: {deg}°</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            disabled={playing}
            aria-label="Giro em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setDeg(p)} disabled={playing}>
            {p}°
          </button>
        ))}
        <button type="button" onClick={() => play()}>
          Ver o giro de novo
        </button>
      </div>
    </div>
  );
}
