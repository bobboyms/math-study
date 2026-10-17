import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';

// Mesma base, mesma altura: um controle deslizante empurra o topo da figura
// para o lado, numa reta paralela à base. Os lados inclinados mudam de
// comprimento; a área não muda.
//
// É interativo porque o movimento É o argumento contra o erro mais comum da
// lição de áreas — usar o lado inclinado como altura. Se o lado decidisse a
// área, ela mudaria junto com ele; o painel mostra que não muda.
//
// No triângulo, o topo pode passar além das pontas da base: a altura cai fora
// da figura, a base é prolongada em tracejado e a área continua a mesma.

const UNIT = 30;

const text = (value, digits = 2) => mathNumber(value, digits).replace('{,}', ',');

export default function ShearExplorer({
  shape = 'triangle',
  base = 6,
  height = 4,
  sMin,
  sMax,
  initial,
}) {
  const isTriangle = shape === 'triangle';
  const min = sMin ?? (isTriangle ? -3 : 0);
  const max = sMax ?? (isTriangle ? base + 3 : 5);
  const [s, setS] = useState(initial ?? 2);

  const b = base;
  const h = height;
  const area = isTriangle ? (b * h) / 2 : b * h;
  const foot = [s, 0];
  const top = [s, h];

  const polygon = isTriangle
    ? [[0, 0], [b, 0], top]
    : [[0, 0], [b, 0], [b + s, h], top];

  const segments = [{from: foot, to: top, tone: 3, dashed: true}];
  // Prolongamento da base até o pé da altura, quando ele cai fora do segmento.
  const outside = isTriangle && (s < 0 || s > b);
  if (outside) {
    segments.push({from: s < 0 ? [0, 0] : [b, 0], to: foot, dashed: true});
  }

  // Quadradinho do ângulo reto no pé da altura, virado para dentro da figura.
  const angles = [
    {at: foot, from: [s + (s <= b / 2 ? 1 : -1), 0], to: top, right: true, tone: 3},
  ];

  const leftSide = Math.hypot(s, h);
  const rightSide = Math.hypot(b - s, h);

  const xMin = Math.min(min, 0) - 0.3;
  const xMax = isTriangle ? Math.max(max, b) + 0.3 : b + max + 0.3;

  const wrong = b * leftSide;

  return (
    <div className={shared.wrapper} data-explorer="shear">
      <GeoFigure
        unit={UNIT}
        padding={34}
        bounds={[xMin, -0.6, xMax, h + 0.4]}
        polygons={[{points: polygon, tone: 1}]}
        segments={segments}
        angles={angles}
        labels={[
          {at: [b / 2, 0], math: `b = ${b}`, tone: 1, dy: 18},
          // O rótulo da altura vai para o lado onde a figura tem mais espaço.
          {at: [s, h / 2], math: `h = ${h}`, tone: 3, dx: !isTriangle || s < b / 2 ? 26 : -26},
          ...(isTriangle ? [] : [{
            at: [s / 2, h / 2],
            math: '\\ell',
            tone: 2,
            // Afastado na perpendicular do lado inclinado, para fora da figura.
            dx: (-h / Math.hypot(s, h)) * 16,
            dy: (-s / Math.hypot(s, h)) * 16,
          }]),
        ]}
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {isTriangle ? (
          <>
            <p>
              Lado esquerdo: <strong>{text(leftSide)}</strong>. Lado direito:{' '}
              <strong>{text(rightSide)}</strong>. Base e altura não mudam.
            </p>
            <div className={shared.formula}>
              <Formula math={`A = \\frac{b \\times h}{2} = \\frac{${b} \\times ${h}}{2} = ${mathNumber(area)}`} />
            </div>
            <p className={styles.note}>
              {outside
                ? `O pé da altura caiu fora da base. A base foi prolongada em tracejado só para receber a perpendicular — e a área continua ${text(area)}.`
                : `Os dois lados mudaram de tamanho, e a área continua ${text(area)}. Os lados não decidem a área.`}
            </p>
          </>
        ) : (
          <>
            <p>
              Lado inclinado: <strong>ℓ ≈ {text(leftSide)}</strong>. Base e altura não mudam.
            </p>
            <div className={shared.formula}>
              <Formula math={`A = b \\times h = ${b} \\times ${h} = ${mathNumber(area)}`} />
            </div>
            <div className={shared.formula}>
              <Formula
                math={`b \\times \\ell \\approx ${b} \\times ${mathNumber(leftSide, 2)} = ${mathNumber(wrong, 2)}`}
              />
            </div>
            <p className={styles.note}>
              {Math.abs(s) < 1e-9
                ? 'Com o topo sem deslocamento, a figura é um retângulo: o lado é a própria altura, e os dois produtos coincidem.'
                : `O produto b × ℓ mudou para ${text(wrong)}, mas a área continua ${text(area)}: o retângulo recortado tem sempre base ${b} e altura ${h}.`}
            </p>
          </>
        )}
      </div>

      <label className={shared.control}>
        <span>Empurre o topo para o lado</span>
        <span className={shared.hint}>
          O topo anda sobre uma reta paralela à base, sempre à mesma altura.
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={0.5}
          value={s}
          onChange={(event) => setS(Number(event.target.value))}
          aria-label="Deslocamento do topo"
          aria-valuetext={`Deslocamento ${text(s)}; área ${text(area)}`}
        />
      </label>
    </div>
  );
}
