import React, {useState} from 'react';
import UnitCircle from '../UnitCircle';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// O ciclo trigonométrico com um deslizante para o giro.
//
// É o UnitCircle com projeções, mas com o ângulo vivo: o aluno arrasta e vê o
// cosseno (segmento verde no eixo horizontal) e o seno (segmento laranja no
// eixo vertical) acompanharem o ponto, inclusive trocando de sinal quando o
// ponto passa para a esquerda ou para baixo.
//
// Na primeira vez que aparece na tela, o ponto gira de `from` até `initial`.
//
// `showTurns` acrescenta ao painel a redução à primeira volta: é a versão da
// seção de arcos côngruos, com giros negativos e maiores que 360°.

const sideX = (c) =>
  Math.abs(c) < 1e-9
    ? 'P está sobre o eixo vertical'
    : c > 0
      ? 'P está à direita do eixo vertical'
      : 'P está à esquerda do eixo vertical';

const sideY = (s) =>
  Math.abs(s) < 1e-9
    ? 'P está sobre o eixo horizontal'
    : s > 0
      ? 'P está acima do eixo horizontal'
      : 'P está abaixo do eixo horizontal';

function reduction(deg) {
  const rest = ((deg % 360) + 360) % 360;
  const k = (deg - rest) / 360;
  if (k === 0) return null;
  if (k > 0) {
    const voltas = k === 1 ? '1 volta' : `${k} voltas`;
    return `${deg}° são ${voltas} completa${k === 1 ? '' : 's'} e mais ${rest}°. P está no mesmo ponto de ${rest}°.`;
  }
  const voltas = -k === 1 ? '1 volta' : `${-k} voltas`;
  return `${deg}° é um giro no sentido horário. Somando ${voltas} (${-k * 360}°), chega-se a ${rest}°: P está no mesmo ponto de ${rest}°.`;
}

export default function CycleExplorer({
  initial = 360,
  from = 0,
  min = 0,
  max = 360,
  step = 5,
  duration = 4,
  showTurns = false,
  presets = [0, 90, 180, 270, 360],
  caption = 'Arraste o giro. O segmento verde no eixo horizontal é o cosseno; o laranja no eixo vertical é o seno.',
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration});
  const shown = playing ? Math.round(from + ease(t / duration) * (deg - from)) : deg;

  const th = (shown * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const tidy = (v) => (Math.abs(v) < 1e-9 ? 0 : v);
  // "=" quando o arredondamento a três casas não perde nada (cos 180° = −1).
  const rel = (v) => (Math.abs(v - Number(v.toFixed(3))) < 1e-9 ? '=' : '\\approx');
  const pRel = rel(c) === '=' && rel(s) === '=' ? '=' : '\\approx';
  // Notação da casa: ponto e vírgula entre as coordenadas quando alguma tem vírgula.
  const sep = /,/.test(mathNumber(tidy(c)) + mathNumber(tidy(s))) ? ';' : ',';

  return (
    <div className={shared.wrapper} data-explorer="cycle">
      <div ref={ref}>
        <UnitCircle
          scale={110}
          padding={40}
          angles={[{
            deg: shown,
            // Depois de uma volta, o meio do arco cai longe do ponto: o rótulo confundiria.
            label: Math.abs(shown) >= 15 && Math.abs(shown) < 360 ? '\\theta' : null,
            showProjections: true,
            pointLabel: 'P',
            pointDx: c >= 0 ? 12 : -12,
          }]}
          caption={caption}
        />
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula
            math={`\\theta = ${shown}^\\circ \\qquad P ${pRel} (${mathNumber(tidy(c))}${sep}\\ ${mathNumber(tidy(s))})`}
          />
        </div>
        <p>
          <Formula math={`\\cos\\theta ${rel(c)} ${mathNumber(tidy(c))}`} />: {sideX(c)}.{' '}
          <Formula math={`\\sen\\theta ${rel(s)} ${mathNumber(tidy(s))}`} />: {sideY(s)}.
        </p>
        {showTurns && reduction(shown) && <p>{reduction(shown)}</p>}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro: {deg}°</span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
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
            {String(p).replace('-', '−')}°
          </button>
        ))}
        <button type="button" onClick={() => play()}>
          Ver o giro de novo
        </button>
      </div>
    </div>
  );
}
