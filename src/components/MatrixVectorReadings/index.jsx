import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, Brackets, WideMath, num, factor, plain, pairTex, dotTex} from '../MatrixKit';
import styles from './styles.module.css';

// As duas leituras do produto de matriz por vetor (lição 11.3).
//
// Painel "por linhas": a matriz, o vetor em pé e o resultado. Cada linha da
// matriz acende (azul) junto com o vetor inteiro (laranja); na primeira
// linha, os pares se encontram um de cada vez (a linha anda para a direita,
// o vetor anda para baixo). A conta da linha é escrita embaixo, e o número
// vai para a coordenada da linha no resultado (verde).
//
// Painel "por colunas": cada coluna da matriz recebe o seu peso, que é uma
// coordenada do vetor (laranja). A coluna multiplicada desce para a segunda
// fileira; no fim, as colunas multiplicadas são somadas e dão o resultado.
//
// No modo 'both' os dois painéis aparecem lado a lado e animam juntos, e o
// resultado verde é o mesmo nos dois. Com `sliders`, o aluno muda as
// coordenadas do vetor escolhidas e o painel escreve a diferença como peso
// vezes coluna: mudar um peso move o resultado na direção daquela coluna.

const CW = 40;
const CH = 30;
const RW = 50;
const LINE_H = 24;
const PS = 0.42; // um par da primeira linha
const RS = 0.8; // uma linha inteira, da segunda em diante
const CS = 0.7; // uma coluna

const mulMatVec = (A, x) => A.map((row) => row.reduce((s, a, j) => s + a * x[j], 0));

function rowsTiming(m, n) {
  const firstEnd = n * PS + 0.3;
  return {firstEnd, total: firstEnd + (m - 1) * RS};
}
const colsTotal = (n) => n * CS + 0.8;

function RowsPanel({A, x, rowNames, colNames, t, matrixName, vectorName, resultName}) {
  const m = A.length;
  const n = A[0].length;
  const nameW = rowNames ? 74 : 0;
  const MX = 8 + nameW;
  const GT = colNames ? 42 : 26;
  const rowsH = Math.max(m, n) * CH;
  const MT = GT + (rowsH - m * CH) / 2;
  const VT = GT + (rowsH - n * CH) / 2;
  const VX = MX + n * CW + 18;
  const EQX = VX + CW + 16;
  const RX = EQX + 14;
  const W = Math.max(RX + RW + 10, 330);
  const LY0 = GT + rowsH + 24;
  const H = LY0 + m * LINE_H;
  const res = mulMatVec(A, x);
  const {firstEnd} = rowsTiming(m, n);

  // Estado de cada linha no tempo t: quantos pares já entraram e se o
  // resultado já foi escrito.
  const rowState = (i) => {
    if (i === 0) {
      if (t <= 0) return {active: false, pair: -1, pairs: 0, result: 0};
      const during = t < n * PS;
      const p = Math.floor(t / PS);
      return {
        active: t < firstEnd,
        pair: during ? p : -1,
        pairs: during ? p + 1 : n,
        result: stage(t, n * PS, firstEnd),
      };
    }
    const a = firstEnd + (i - 1) * RS;
    return {
      active: t >= a && t < a + RS,
      pair: -1,
      pairs: t >= a ? n : 0,
      result: stage(t, a + RS - 0.35, a + RS),
    };
  };
  const states = A.map((_, i) => rowState(i));
  const anyActive = states.some((s) => s.active);

  return (
    <svg
      className={geo.svg}
      viewBox={`0 0 ${W} ${H}`}
      style={{maxWidth: `${W + 30}px`}}
      role="img"
      aria-label={`Leitura por linhas: cada coordenada do resultado é o produto escalar de uma linha da matriz com o vetor. Resultado ${res.map(plain).join(', ')}.`}
    >
      <SvgMath x={MX + (n * CW) / 2} y={GT - (colNames ? 30 : 14)} math={matrixName} fontSize={14} tone={1} />
      <SvgMath x={VX + CW / 2} y={GT - (colNames ? 30 : 14)} math={vectorName} fontSize={14} tone={2} />
      <SvgMath x={RX + RW / 2} y={GT - (colNames ? 30 : 14)} math={resultName} fontSize={14} tone={3} />
      {colNames &&
        colNames.map((c, j) => (
          <SvgMath key={`cn${j}`} x={MX + j * CW + CW / 2} y={GT - 10} math={`\\text{${c}}`} fontSize={11} />
        ))}
      {A.map((row, i) => {
        const s = states[i];
        return (
          <g key={`r${i}`}>
            {rowNames && (
              <SvgMath
                x={MX - 8}
                y={MT + i * CH + CH / 2}
                math={`\\text{${rowNames[i]}}`}
                fontSize={12}
                anchor="end"
                space={nameW - 4}
                tone={s.active ? 1 : undefined}
              />
            )}
            {row.map((a, j) => (
              <Cell
                key={j}
                x={MX + j * CW}
                y={MT + i * CH}
                w={CW}
                h={CH}
                math={num(a)}
                fill={s.active ? 1 : 0}
                tone={s.pair === j ? 1 : 0}
                strong={s.pair === j}
              />
            ))}
          </g>
        );
      })}
      <Brackets x0={MX - 4} y0={MT - 3} x1={MX + n * CW + 4} y1={MT + m * CH + 3} />

      {x.map((v, j) => {
        const pairOn = states[0].pair === j;
        return (
          <Cell
            key={`v${j}`}
            x={VX}
            y={VT + j * CH}
            w={CW}
            h={CH}
            math={num(v)}
            fill={anyActive ? 2 : 0}
            tone={pairOn ? 2 : 0}
            strong={pairOn}
          />
        );
      })}
      <Brackets x0={VX - 4} y0={VT - 3} x1={VX + CW + 4} y1={VT + n * CH + 3} />

      <SvgMath x={EQX} y={MT + (m * CH) / 2} math="=" fontSize={16} />
      {res.map((r, i) => (
        <g key={`res${i}`} opacity={states[i].result}>
          <Cell x={RX} y={MT + i * CH} w={RW} h={CH} math={num(r)} fill={3} />
        </g>
      ))}
      <Brackets x0={RX - 4} y0={MT - 3} x1={RX + RW + 4} y1={MT + m * CH + 3} />

      {A.map((row, i) => {
        const s = states[i];
        if (s.pairs === 0) return null;
        const label = rowNames ? `\\text{${rowNames[i]}: }` : `\\text{linha ${i + 1}: }`;
        const body = dotTex(row.slice(0, s.pairs), x.slice(0, s.pairs));
        const tail = s.result > 0.5 ? ` = ${num(res[i])}` : '';
        return (
          <WideMath
            key={`l${i}`}
            x={8}
            y={LY0 + i * LINE_H}
            math={`${label}${body}${tail}`}
            fontSize={13}
            width={W - 10}
            tone={s.active ? 1 : undefined}
          />
        );
      })}
    </svg>
  );
}

function ColumnsPanel({A, x, colNames, t, resultName}) {
  const m = A.length;
  const n = A[0].length;
  const PLUS = 18;
  const CB = CW + 12;
  const X0 = 10;
  const colX = (j) => X0 + 6 + j * (CB + PLUS);
  const top = colNames ? 18 : 4;
  const CHIP_Y = top + 14;
  const T1 = CHIP_Y + 20;
  const T2 = T1 + m * CH + 30;
  const EQ = colX(n - 1) + CW + 6 + 14;
  const RX = EQ + 14;
  const W = RX + RW + 10;
  const H = T2 + m * CH + 10;
  const res = mulMatVec(A, x);

  const colK = (j) => stage(t, j * CS, (j + 1) * CS - 0.1);
  const colOn = (j) => t >= j * CS && t < (j + 1) * CS;
  const sumK = stage(t, n * CS, n * CS + 0.7);

  return (
    <svg
      className={geo.svg}
      viewBox={`0 0 ${W} ${H}`}
      style={{maxWidth: `${W + 30}px`}}
      role="img"
      aria-label={`Leitura por colunas: cada coluna da matriz é multiplicada pelo seu peso, que é uma coordenada do vetor, e as colunas multiplicadas são somadas. Resultado ${res.map(plain).join(', ')}.`}
    >
      {Array.from({length: n}, (_, j) => {
        const cx = colX(j);
        const k = colK(j);
        const on = colOn(j);
        const scaled = A.map((row) => row[j] * x[j]);
        return (
          <g key={`c${j}`}>
            {colNames && (
              <SvgMath x={cx + CW / 2} y={top - 6} math={`\\text{${colNames[j]}}`} fontSize={10} />
            )}
            <SvgMath
              x={cx + CW / 2}
              y={CHIP_Y}
              math={`${factor(x[j])} \\times`}
              fontSize={14}
              tone={2}
            />
            {A.map((row, i) => (
              <Cell
                key={`a${i}`}
                x={cx}
                y={T1 + i * CH}
                w={CW}
                h={CH}
                math={num(row[j])}
                fill={on ? 1 : 0}
                tone={on ? 1 : 0}
              />
            ))}
            <Brackets x0={cx - 4} y0={T1 - 3} x1={cx + CW + 4} y1={T1 + m * CH + 3} tone={1} />
            {/* seta da coluna para a coluna multiplicada */}
            <g opacity={k}>
              <path
                d={`M ${cx + CW / 2} ${T1 + m * CH + 6} L ${cx + CW / 2} ${T2 - 8}`}
                stroke="var(--mv-tone-2)"
                strokeWidth={1.5}
              />
              <path
                d={`M ${cx + CW / 2} ${T2 - 5} l -4 -7 l 8 0 Z`}
                fill="var(--mv-tone-2)"
              />
            </g>
            {scaled.map((v, i) => (
              <g key={`s${i}`} opacity={k}>
                <Cell
                  x={cx}
                  y={T2 + i * CH - 14 * (1 - k)}
                  w={CW}
                  h={CH}
                  math={num(v)}
                  fill={on ? 2 : 0}
                />
              </g>
            ))}
            <g opacity={k}>
              <Brackets x0={cx - 4} y0={T2 - 3} x1={cx + CW + 4} y1={T2 + m * CH + 3} />
            </g>
            {j < n - 1 && (
              <g opacity={sumK}>
                <SvgMath x={cx + CW + 6 + PLUS / 2} y={T2 + (m * CH) / 2} math="+" fontSize={15} />
              </g>
            )}
          </g>
        );
      })}
      <g opacity={sumK}>
        <SvgMath x={EQ} y={T2 + (m * CH) / 2} math="=" fontSize={16} />
        {res.map((r, i) => (
          <Cell key={`r${i}`} x={RX} y={T2 + i * CH} w={RW} h={CH} math={num(r)} fill={3} />
        ))}
        <Brackets x0={RX - 4} y0={T2 - 3} x1={RX + RW + 4} y1={T2 + m * CH + 3} />
        <SvgMath x={RX + RW / 2} y={T2 - 14} math={resultName} fontSize={14} tone={3} />
      </g>
    </svg>
  );
}

export default function MatrixVectorReadings({
  matrix,
  vector,
  rowNames,
  colNames,
  matrixName = 'A',
  vectorName = '\\vec{x}',
  resultName,
  mode = 'both',
  sliders,
  sliderRange = [0, 20],
  sliderNames,
  unit,
  caption,
}) {
  const m = matrix.length;
  const n = matrix[0].length;
  const rName = resultName ?? `${matrixName}${vectorName}`;
  const rowsDur = rowsTiming(m, n).total;
  const colsDur = colsTotal(n);
  const LEAD = 0.3;
  const durOf = (focus) =>
    LEAD + (focus === 'rows' ? rowsDur : focus === 'columns' ? colsDur : Math.max(rowsDur, colsDur)) + 0.3;
  const initialFocus = mode === 'both' ? 'all' : mode;

  const [focus, setFocus] = useState(initialFocus);
  const [x, setX] = useState(vector);
  const {ref, t, play, playing} = useAnimation({duration: durOf(initialFocus)});

  const local = t - LEAD;
  const BIG = 1e6;
  const tRows = focus === 'columns' ? BIG : local;
  const tCols = focus === 'rows' ? BIG : local;

  const res = mulMatVec(matrix, x);
  const base = mulMatVec(matrix, vector);
  const deltas = x.map((v, j) => v - vector[j]);
  const changed = deltas.map((d, j) => [d, j]).filter(([d]) => d !== 0);

  const replay = (f) => {
    setFocus(f);
    play({duration: durOf(f)});
  };

  const showRows = mode === 'rows' || mode === 'both';
  const showCols = mode === 'columns' || mode === 'both';

  let diffMath = null;
  if (sliders && changed.length > 0) {
    const terms = changed
      .map(([d, j]) => {
        const col = matrix.map((row) => row[j]);
        return `${d < 0 ? '-' : '+'} ${Math.abs(d) === 1 ? '' : num(Math.abs(d))}${pairTex(col)}`;
      })
      .join(' ');
    diffMath = `${rName} = ${pairTex(base)} ${terms} = ${pairTex(res)}`;
  }

  return (
    <div className={shared.wrapper} data-explorer="matrix-vector-readings">
      <figure ref={ref} className={geo.figure} style={{margin: 0}}>
        <div className={mode === 'both' ? styles.panels : styles.single}>
          {showRows && (
            <div className={styles.panel}>
              <p className={styles.title}>
                <strong>Por linhas:</strong> cada linha com o vetor inteiro
              </p>
              <RowsPanel
                A={matrix}
                x={x}
                rowNames={rowNames}
                colNames={colNames}
                t={tRows}
                matrixName={matrixName}
                vectorName={vectorName}
                resultName={rName}
              />
            </div>
          )}
          {showCols && (
            <div className={styles.panel}>
              <p className={styles.title}>
                <strong>Por colunas:</strong> cada coluna vezes o seu peso
              </p>
              <ColumnsPanel A={matrix} x={x} colNames={colNames} t={tCols} resultName={rName} />
            </div>
          )}
        </div>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>

      {sliders && (
        <div className={shared.controls} style={{marginTop: '1rem'}}>
          {sliders.map((j) => (
            <label key={j} className={shared.control}>
              <span>
                {sliderNames ? sliderNames[j] : `Coordenada ${j + 1} do vetor`}: <strong>{plain(x[j])}</strong>
              </span>
              <input
                type="range"
                min={sliderRange[0]}
                max={sliderRange[1]}
                step={1}
                value={x[j]}
                disabled={playing}
                onChange={(e) => {
                  const next = [...x];
                  next[j] = Number(e.target.value);
                  setX(next);
                }}
                aria-label={sliderNames ? sliderNames[j] : `Coordenada ${j + 1} do vetor`}
              />
            </label>
          ))}
        </div>
      )}

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {mode === 'both' && (
          <p>
            As duas leituras chegam ao mesmo resultado, <Formula math={pairTex(res)} />
            {unit ? ` (em ${unit})` : ''}: elas somam os mesmos produtos, agrupados de dois jeitos.
          </p>
        )}
        {sliders && changed.length === 0 && (
          <p>
            Mexa num controle. O painel vai escrever o resultado novo como o resultado de agora mais a coluna de
            cada peso que mudou, vezes a mudança.
          </p>
        )}
        {diffMath && (
          <p className={shared.formula}>
            <Formula math={diffMath} />
          </p>
        )}
        {diffMath && (
          <p>
            Só {changed.length === 1 ? 'a coluna do peso que mudou entrou' : 'as colunas dos pesos que mudaram entraram'}{' '}
            na diferença. As outras colunas continuam com o mesmo peso e não mudam nada.
          </p>
        )}
      </div>

      <div className={shared.buttons}>
        {mode === 'both' ? (
          <>
            <button type="button" onClick={() => replay('all')} disabled={playing}>
              Ver as duas leituras de novo
            </button>
            <button type="button" onClick={() => replay('rows')} disabled={playing}>
              Só a leitura por linhas
            </button>
            <button type="button" onClick={() => replay('columns')} disabled={playing}>
              Só a leitura por colunas
            </button>
          </>
        ) : (
          <button type="button" onClick={() => replay(mode)} disabled={playing}>
            Ver a conta de novo
          </button>
        )}
        {sliders && (
          <button
            type="button"
            disabled={playing || changed.length === 0}
            onClick={() => setX(vector)}
          >
            Voltar ao vetor inicial
          </button>
        )}
      </div>
    </div>
  );
}
