import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Fator comum em evidência visto como área: retângulos de MESMA altura, que se
// juntam num retângulo só (fatorar) ou se separam de novo (distribuir).
//
// Na primeira vez que a figura aparece na tela, os retângulos começam
// separados, cada um com a sua altura anotada, e deslizam até encostar. A
// segunda anotação da altura some, porque a altura passa a ser escrita uma vez
// só — é exatamente o que o parêntese faz na escrita. O quadro final é o
// retângulo juntado, com a largura somada embaixo.
//
// Os botões repetem o movimento nos dois sentidos, para o aluno ver que
// fatorar e distribuir são o mesmo desenho percorrido ao contrário.
//
// `grid` desenha a malha de quadradinhos, para quando a lição quer que a área
// seja contada (3 × 2 + 3 × 5 = 3 × 7). Só faz sentido com medidas inteiras.
//
// `slider` faz a altura comum variar: os dois retângulos crescem juntos, e o
// painel mostra a conta separada e a conta juntada dando o mesmo resultado.

const W = 440;
const LEFT = 64; // espaço do rótulo da altura
const GAP = 64; // vão entre os retângulos separados
const TOP = 34;
const DURATION = 1.8;

const tones = ['var(--mv-tone-1)', 'var(--mv-tone-2)', 'var(--mv-tone-3)'];

// Número com vírgula decimal e espaço fino nos milhares, como no texto das
// lições (1 240 e 0,92), em LaTeX.
export function texNumber(value, digits = 0) {
  const [int, dec] = Math.abs(value).toFixed(digits).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  const sign = value < 0 ? '-' : '';
  return dec ? `${sign}${grouped}{,}${dec}` : `${sign}${grouped}`;
}

function HeightBracket({x, y, h, label, opacity}) {
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity}>
      <path
        d={`M ${x + 6} ${y} L ${x} ${y} L ${x} ${y + h} L ${x + 6} ${y + h}`}
        fill="none"
        stroke="var(--ifm-font-color-base)"
        strokeWidth={1.25}
      />
      <SvgMath x={x - 6} y={y + h / 2} math={label} anchor="end" space={LEFT - 10} fontSize={15} />
    </g>
  );
}

export default function CommonFactorArea({
  factor,
  parts,
  sumLabel,
  splitFormula,
  mergedFormula,
  heightSize = 3,
  unit = 30,
  grid = false,
  slider,
  start = 'merged',
  buttons = true,
  caption,
}) {
  // `start="split"` deixa a figura parada com os retângulos separados (o
  // problema motivador, antes de a lição ensinar a juntar). Sem botões, o
  // painel do deslizante mostra só a conta separada.
  const still = start === 'split';
  const [dir, setDir] = useState(still ? 'split' : 'merge');
  const [value, setValue] = useState(slider ? slider.initial : null);
  const {ref, t, play} = useAnimation({duration: DURATION, autoplay: !still});

  const s = stage(t, 0.25, DURATION - 0.15);
  const p = dir === 'merge' ? s : 1 - s; // 0 = separado, 1 = juntado
  const merged = p > 0.98;

  const h = slider ? (value / slider.max) * heightSize * unit : heightSize * unit;
  const maxH = heightSize * unit;
  const y = TOP + (maxH - h);
  const widths = parts.map((part) => part.size * unit);
  const gap = GAP * (1 - p);
  const xs = widths.reduce(
    (acc, w, i) => [...acc, acc[i] + w + (i < widths.length - 1 ? gap : 0)],
    [LEFT],
  );
  const totalW = widths.reduce((a, b) => a + b, 0);
  const bottom = TOP + maxH;
  const H = bottom + 64;

  const go = (next) => {
    setDir(next);
    play();
  };

  // O valor da altura aparece no deslizante; no desenho fica só a letra,
  // que é o que a escrita fatorada põe do lado de fora do parêntese.
  const factorTex = factor;

  return (
    <div className={shared.wrapper} data-explorer="common-factor-area">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={
            merged
              ? `Os retângulos de mesma altura estão juntos: um retângulo só, de altura ${factor}.`
              : `Retângulos separados, todos com a mesma altura ${factor}.`
          }
        >
          {parts.map((part, i) => {
            const left = xs[i];
            const w = widths[i];
            const tone = tones[(part.tone ?? i + 1) - 1];
            return (
              <g key={i}>
                <rect
                  x={left}
                  y={y}
                  width={w}
                  height={h}
                  fill={tone}
                  fillOpacity={0.2}
                  stroke={tone}
                  strokeWidth={2}
                />
                {grid &&
                  Array.from({length: part.size - 1}, (_, k) => (
                    <line
                      key={`c${k}`}
                      x1={left + (k + 1) * unit}
                      y1={y}
                      x2={left + (k + 1) * unit}
                      y2={y + h}
                      stroke={tone}
                      strokeOpacity={0.55}
                      strokeWidth={1}
                    />
                  ))}
                {grid &&
                  Array.from({length: heightSize - 1}, (_, k) => (
                    <line
                      key={`r${k}`}
                      x1={left}
                      y1={y + (k + 1) * unit}
                      x2={left + w}
                      y2={y + (k + 1) * unit}
                      stroke={tone}
                      strokeOpacity={0.55}
                      strokeWidth={1}
                    />
                  ))}
                <SvgMath x={left + w / 2} y={y + h / 2} math={part.area} fontSize={part.fontSize ?? 15} halo={grid} />
                <SvgMath x={left + w / 2} y={bottom + 14} math={part.label} fontSize={14} />
                {i > 0 && (
                  <HeightBracket x={left - 8} y={y} h={h} label={factor} opacity={1 - p * 1.6} />
                )}
              </g>
            );
          })}

          <HeightBracket x={LEFT - 8} y={y} h={h} label={factorTex} opacity={1} />

          {/* largura somada, que só existe quando os retângulos encostam */}
          {sumLabel && p > 0.6 && (
            <g opacity={(p - 0.6) / 0.4}>
              <path
                d={`M ${LEFT} ${bottom + 30} L ${LEFT} ${bottom + 36} L ${LEFT + totalW} ${bottom + 36} L ${LEFT + totalW} ${bottom + 30}`}
                fill="none"
                stroke="var(--ifm-font-color-base)"
                strokeWidth={1.25}
              />
              <SvgMath x={LEFT + totalW / 2} y={bottom + 52} math={sumLabel} fontSize={14} />
            </g>
          )}
        </svg>
        {caption && <figcaption className={geo.caption}>{caption}</figcaption>}
      </figure>

      {(splitFormula || mergedFormula) && (
        <div className={shared.readout} aria-live="polite">
          <p className={shared.formula}>
            <Formula math={merged ? mergedFormula : splitFormula} />
          </p>
        </div>
      )}

      {slider && (
        <>
          <div className={shared.readout} aria-live="polite">
            <p className={shared.formula}>
              Separado:{' '}
              <Formula
                math={`${parts
                  .map((part) => `${texNumber(part.value)} \\times ${texNumber(value, slider.digits ?? 2)}`)
                  .join(' + ')} = ${parts
                  .map((part) => texNumber(part.value * value, slider.digits ?? 2))
                  .join(' + ')} = ${texNumber(
                  parts.reduce((acc, part) => acc + part.value * value, 0),
                  slider.digits ?? 2,
                )}`}
              />
            </p>
            {(buttons || !still) && (
            <p className={shared.formula}>
              Juntado:{' '}
              <Formula
                math={`${texNumber(parts.reduce((acc, part) => acc + part.value, 0))} \\times ${texNumber(
                  value,
                  slider.digits ?? 2,
                )} = ${texNumber(
                  parts.reduce((acc, part) => acc + part.value, 0) * value,
                  slider.digits ?? 2,
                )}`}
              />
            </p>
            )}
          </div>
          <div className={shared.controls}>
            <label className={shared.control}>
              <span>
                {slider.label}: {texNumber(value, slider.digits ?? 2).replace('{,}', ',').replace(/\\,/g, ' ')}
              </span>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
                aria-label={slider.label}
              />
            </label>
          </div>
        </>
      )}

      {buttons && (
      <div className={shared.buttons}>
        <button type="button" onClick={() => go('merge')} aria-pressed={dir === 'merge'}>
          Juntar (fatorar)
        </button>
        <button type="button" onClick={() => go('split')} aria-pressed={dir === 'split'}>
          Separar (distribuir)
        </button>
      </div>
      )}
    </div>
  );
}
