import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';

// O pedreiro sem esquadro: a linha da primeira parede está fixa, a da segunda
// gira em torno da estaca do canto, e a única informação disponível é a leitura
// da trena entre as marcas de 3 m e 4 m. O ângulo começa escondido de propósito
// — o pedreiro também não o enxerga — e só aparece quando o aluno pede.
//
// É interativo porque girar a linha até a trena bater É a ideia: a recíproca
// de Pitágoras transforma "o canto está reto?" em "a trena marca 5,00 m?".
//
// A leitura é arredondada ao centímetro, como a de uma trena esticada na obra.
// É isso que faz o triângulo pequeno (60 · 80 · 100 cm) "aprovar" um canto de
// 89,5°: o desvio existe, mas fica abaixo do que a trena enxerga.

const SIZES = [
  {k: 0.2, label: '60 cm · 80 cm · 1 m'},
  {k: 0.5, label: '1,5 m · 2 m · 2,5 m'},
  {k: 1, label: '3 m · 4 m · 5 m'},
];

const MIN_ANGLE = 70;
const MAX_ANGLE = 110;
const STEP = 0.5;
const WALL_1 = 5.5;
const WALL_2 = 5;

const toRad = (deg) => (deg * Math.PI) / 180;

// Número com casas fixas e vírgula decimal: `math` protege a vírgula para o
// KaTeX, `text` serve para o texto corrido.
const fixed = (value, digits) => Number(value).toFixed(digits);
const math = (value, digits) => fixed(value, digits).replace('.', '{,}');
const text = (value, digits) => fixed(value, digits).replace('.', ',');
const angleText = (deg) => String(deg).replace('.', ',');

// Ângulo torto para recomeçar: entre 4° e 14° longe do reto, para qualquer lado.
function crookedAngle() {
  const offset = 4 + Math.floor(Math.random() * 21) * STEP;
  return Math.random() < 0.5 ? 90 - offset : 90 + offset;
}

function lengthLabel(meters) {
  return meters < 1
    ? `${Math.round(meters * 100)}\\,\\text{cm}`
    : `${math(meters, meters % 1 === 0 ? 0 : 1)}\\,\\text{m}`;
}

export default function RightAngleExplorer({initialAngle = 84, initialSize = 2}) {
  const [angle, setAngle] = useState(initialAngle);
  const [sizeIndex, setSizeIndex] = useState(initialSize);
  const [revealed, setRevealed] = useState(false);

  const {k} = SIZES[sizeIndex];
  const a = 3 * k;
  const b = 4 * k;
  const c = 5 * k;

  const theta = toRad(angle);
  const markA = [a, 0];
  const markB = [b * Math.cos(theta), b * Math.sin(theta)];
  const d = Math.hypot(markA[0] - markB[0], markA[1] - markB[1]);

  // A comparação usa a leitura da trena, não o valor exato: é o número que o
  // pedreiro tem na mão.
  const reading = Number(fixed(d, 2));
  const target = Number(fixed(c, 2));
  const status = reading > target ? 'open' : reading < target ? 'closed' : 'match';
  const readingSquared = reading * reading;
  const sumSquares = a * a + b * b;
  const isRight = angle === 90;

  const end2 = [WALL_2 * Math.cos(theta), WALL_2 * Math.sin(theta)];
  // Lado de fora da segunda linha: a direção dela girada de 90° no sentido
  // anti-horário, convertida para pixels (no SVG, y cresce para baixo).
  const outside = [-Math.sin(theta), Math.cos(theta)];
  const mid = [(markA[0] + markB[0]) / 2, (markA[1] + markB[1]) / 2];
  const midLen = Math.hypot(mid[0], mid[1]) || 1;

  const relation = status === 'open' ? '>' : status === 'closed' ? '<' : '=';

  const restart = () => {
    setAngle(crookedAngle());
    setRevealed(false);
  };

  return (
    <div className={shared.wrapper} data-explorer="right-angle">
      <div className={styles.sizes} role="group" aria-label="Tamanho do triângulo">
        <span className={shared.hint}>Tamanho do triângulo marcado com a trena:</span>
        <div className={shared.buttons}>
          {SIZES.map((size, index) => (
            <button
              key={size.label}
              type="button"
              className={index === sizeIndex ? styles.active : undefined}
              aria-pressed={index === sizeIndex}
              onClick={() => setSizeIndex(index)}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <GeoFigure
        unit={44}
        padding={30}
        bounds={[-2.2, -0.7, 6, 5.3]}
        segments={[
          {from: [0, 0], to: [WALL_1, 0]},
          {from: [0, 0], to: end2},
          {
            from: markA,
            to: markB,
            tone: status === 'match' ? 3 : 2,
            dashed: status !== 'match',
          },
        ]}
        angles={[
          isRight && revealed
            ? {at: [0, 0], from: [1, 0], to: end2, right: true, tone: 3}
            : {at: [0, 0], from: [1, 0], to: end2, radius: Math.min(26, a * 44 * 0.45), tone: 3},
        ]}
        points={[
          {at: [0, 0], label: '\\text{estaca}', place: 'left', distance: 38, tone: 0},
          {at: markA, label: lengthLabel(a), place: 'below', distance: 20, tone: 1},
          {at: markB, tone: 1},
        ]}
        labels={[
          {at: markB, math: lengthLabel(b), tone: 1, dx: outside[0] * 34, dy: -outside[1] * 22},
          {
            at: mid,
            math: 'd',
            tone: status === 'match' ? 3 : 2,
            dx: (mid[0] / midLen) * 16,
            dy: -(mid[1] / midLen) * 16,
          },
          {at: [WALL_1, 0], math: '\\text{parede 1}', dx: -8, dy: 16, anchor: 'end', fontSize: 12},
          {at: end2, math: '\\text{parede 2}', dx: outside[0] * 10, dy: -12, fontSize: 12},
        ]}
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={styles.reading}>
          A trena marca <strong>{text(reading, 2)} m</strong>. O valor previsto para
          o canto reto é {text(c, 2)} m.
        </p>
        <div className={shared.formula}>
          <Formula math={`${mathNumber(a)}^2 + ${mathNumber(b)}^2 = ${mathNumber(sumSquares)}`} />
        </div>
        <div className={shared.formula}>
          <Formula math={`d^2 = ${math(reading, 2)}^2 = ${mathNumber(readingSquared, 4)}`} />
        </div>
        <div className={shared.formula}>
          <Formula math={`d^2 ${relation} ${mathNumber(a)}^2 + ${mathNumber(b)}^2`} />
        </div>
        <p className={styles[status]}>
          {status === 'open' &&
            'A trena passou do previsto: as marcas estão afastadas demais. O canto está aberto — gire a linha para fechar.'}
          {status === 'closed' &&
            'A trena ficou abaixo do previsto: as marcas estão perto demais. O canto está fechado — gire a linha para abrir.'}
          {status === 'match' &&
            'A trena bateu com o previsto. Pela recíproca de Pitágoras, o canto está reto — até onde a trena consegue enxergar.'}
        </p>
        {revealed && (
          <p className={styles.truth}>
            Ângulo de verdade: <strong>{angleText(angle)}°</strong>. Diagonal sem
            arredondar: {text(d, 4)} m.
            {status === 'match' && !isRight &&
              ` A trena aprovou, mas o canto está ${angleText(Math.abs(angle - 90))}° fora do reto. Neste triângulo, o desvio afasta as marcas menos de meio centímetro, e a trena não percebe.`}
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Gire a linha da parede 2</span>
          <span className={shared.hint}>
            {revealed
              ? `Ângulo no canto: ${angleText(angle)}°.`
              : 'O ângulo está escondido. Use só a leitura da trena.'}
          </span>
          <input
            type="range"
            min={MIN_ANGLE}
            max={MAX_ANGLE}
            step={STEP}
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
            aria-label="Giro da linha da parede 2"
            aria-valuetext={`Trena marcando ${text(reading, 2)} metros`}
          />
        </label>
        <div className={shared.buttons}>
          <button type="button" onClick={() => setRevealed(!revealed)}>
            {revealed ? 'Esconder o ângulo' : 'Mostrar o ângulo'}
          </button>
          <button type="button" onClick={restart}>
            Entortar a linha
          </button>
        </div>
      </div>
    </div>
  );
}
