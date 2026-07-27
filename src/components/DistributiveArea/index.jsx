import React, {useState} from 'react';
import katex from 'katex';
import styles from './styles.module.css';

// Escala do desenho: 1 unidade de a, b ou c vale UNIT pixels do viewBox.
// A escala é fixa de propósito — assim mexer num controle faz a área crescer
// de verdade, que é o que o aluno precisa ver.
const UNIT = 28;
const PAD = {left: 66, top: 46, right: 16, bottom: 16};
const RANGE = {a: [1, 5], b: [1, 7], c: [1, 7]};

const VIEW_W = PAD.left + (RANGE.b[1] + RANGE.c[1]) * UNIT + PAD.right;
const VIEW_H = PAD.top + RANGE.a[1] * UNIT + PAD.bottom;

function Formula({math, display = false}) {
  return (
    <span
      className={display ? styles.displayFormula : styles.inlineFormula}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, {
          displayMode: display,
          throwOnError: false,
        }),
      }}
    />
  );
}

function TopBracket({x, width, top, label}) {
  const y = top - 14;
  return (
    <g>
      <path
        className={styles.guide}
        d={`M ${x} ${y + 6} L ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + 6}`}
      />
      <text
        className={styles.guideLabel}
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

function LeftBracket({y, height, label}) {
  const x = PAD.left - 14;
  return (
    <g>
      <path
        className={styles.guide}
        d={`M ${x + 6} ${y} L ${x} ${y} L ${x} ${y + height} L ${x + 6} ${y + height}`}
      />
      <text
        className={styles.guideLabel}
        x={x - 8}
        y={y + height / 2}
        textAnchor="end"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}

// O rótulo encolhe conforme o pedaço fica estreito ou baixo, para nunca vazar
// do bloco colorido.
function CellLabel({x, width, y, height, factor, side, product}) {
  const cx = x + width / 2;
  const cy = y + height / 2;

  if (width >= 96 && height >= 26) {
    return (
      <text
        className={styles.cellValue}
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {`${factor} × ${side} = ${product}`}
      </text>
    );
  }

  if (width >= 54 && height >= 46) {
    return (
      <>
        <text
          className={styles.cellFactors}
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {`${factor} × ${side}`}
        </text>
        <text
          className={styles.cellValue}
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {product}
        </text>
      </>
    );
  }

  return (
    <text
      className={styles.cellValue}
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {product}
    </text>
  );
}

export default function DistributiveArea() {
  const [values, setValues] = useState({a: 4, b: 5, c: 6});
  const {a, b, c} = values;

  const areaB = a * b;
  const areaC = a * c;
  const total = a * (b + c);

  const widthB = b * UNIT;
  const widthC = c * UNIT;
  const height = a * UNIT;
  const x0 = PAD.left;
  // Centraliza verticalmente: a altura do quadro é fixa, para que aumentar um
  // dos lados aumente a área na tela em vez de reescalar o desenho inteiro.
  const y0 = PAD.top + ((RANGE.a[1] - a) * UNIT) / 2;

  const updateValue = (name) => (event) => {
    setValues((current) => ({...current, [name]: Number(event.target.value)}));
  };

  return (
    <div className={styles.wrapper}>
      <Formula display math="a \times (b + c) = a \times b + a \times c" />

      <svg
        className={styles.figure}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={`Retângulo de altura ${a} e base ${b} mais ${c}, cortado em duas partes de áreas ${areaB} e ${areaC}, que somam ${total}.`}
      >
        <rect
          className={styles.blockB}
          x={x0}
          y={y0}
          width={widthB}
          height={height}
        />
        <rect
          className={styles.blockC}
          x={x0 + widthB}
          y={y0}
          width={widthC}
          height={height}
        />

        <CellLabel
          x={x0}
          width={widthB}
          y={y0}
          height={height}
          factor={a}
          side={b}
          product={areaB}
        />
        <CellLabel
          x={x0 + widthB}
          width={widthC}
          y={y0}
          height={height}
          factor={a}
          side={c}
          product={areaC}
        />

        <TopBracket x={x0} width={widthB} top={y0} label={`b = ${b}`} />
        <TopBracket
          x={x0 + widthB}
          width={widthC}
          top={y0}
          label={`c = ${c}`}
        />
        <LeftBracket y={y0} height={height} label={`a = ${a}`} />
      </svg>

      <Formula
        display
        math={`\\begin{aligned}
          ${a} \\times (${b} + ${c}) &= ${a} \\times ${b + c} = ${total} \\\\[4pt]
          ${a} \\times ${b} + ${a} \\times ${c} &= ${areaB} + ${areaC} = ${total}
        \\end{aligned}`}
      />

      <p className={styles.reading}>
        A altura <strong>a = {a}</strong> vale para os dois pedaços; o corte
        divide a base em <strong>b = {b}</strong> e <strong>c = {c}</strong>. As
        áreas {areaB} e {areaC} somam <strong>{total}</strong> — a mesma área do
        retângulo inteiro, de {a} por {b + c}. O corte muda a escrita, não a
        quantidade.
      </p>

      <div className={styles.controls}>
        {[
          ['a', 'altura compartilhada'],
          ['b', 'primeira parte da base'],
          ['c', 'segunda parte da base'],
        ].map(([name, description]) => (
          <label className={styles.control} key={name}>
            <span className={styles.controlLabel}>
              <Formula math={name} /> = {values[name]}
            </span>
            <span className={styles.controlHint}>{description}</span>
            <input
              type="range"
              min={RANGE[name][0]}
              max={RANGE[name][1]}
              step={1}
              value={values[name]}
              onChange={updateValue(name)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
