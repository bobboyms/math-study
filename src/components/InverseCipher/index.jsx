import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';

// O código da filial (lição 11.8, Matriz inversa): letras viram números, os
// números andam em pares, e cada par passa por uma matriz.
//
// mode="encode": dois painéis. No primeiro, uma palavra de exemplo é
//   codificada coluna por coluna (letras, números, seta com a matriz, par
//   codificado). No segundo, os pares que chegaram, com setas tracejadas para
//   cima e “?” no lugar das letras: o caminho de volta ainda não existe.
// mode="decode": os pares recebidos descem pela inversa, viram números e os
//   números viram letras. No fim, a palavra inteira embaixo.
// mode="ambiguous": duas palavras diferentes passam pela matriz sem inversa
//   e chegam ao mesmo par; a seta de volta tem duas pontas e um “?”.

const COL = 104;
const PADX = 14;
const Y_LET = 22;
const Y_NUM = 56;
const Y_A0 = 76;
const Y_A1 = 122;
const Y_COD = 144;

const letterOf = (v) => (v >= 1 && v <= 26 ? String.fromCharCode(64 + v) : '?');

function pairTex(p) {
  return `(${p[0]},\\ ${p[1]})`;
}

function DownArrow({x, y0, y1, k, tone, label, dashed = false, up = false}) {
  const len = (y1 - y0) * k;
  if (len < 3) return null;
  const color = tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';
  const a = up ? y1 : y0;
  const b = up ? y1 - len : y0 + len;
  const dir = up ? -1 : 1;
  return (
    <g>
      <line x1={x} y1={a} x2={x} y2={b - dir * 6} stroke={color} strokeWidth={2.2} strokeDasharray={dashed ? '5 4' : undefined} />
      <path d={`M ${x} ${b} L ${x - 5} ${b - dir * 9} L ${x + 5} ${b - dir * 9} Z`} fill={color} />
      {label && k > 0.6 && <SvgMath x={x + 10} y={(y0 + y1) / 2} math={label} anchor="start" fontSize={14} tone={tone} />}
    </g>
  );
}

function Fade({k, children}) {
  return <g opacity={Math.max(0, Math.min(1, k))}>{children}</g>;
}

// Uma coluna da codificação: letras → números → seta → par codificado.
function EncodeColumn({x, letters, nums, coded, t0, t, label, tone = 1}) {
  const kL = stage(t, t0, t0 + 0.3);
  const kN = stage(t, t0 + 0.3, t0 + 0.8);
  const kA = stage(t, t0 + 0.8, t0 + 1.4);
  const kC = stage(t, t0 + 1.4, t0 + 1.8);
  return (
    <g>
      <Fade k={kL}>
        <SvgMath x={x - 18} y={Y_LET} math={`\\text{${letters[0]}}`} fontSize={18} />
        <SvgMath x={x + 18} y={Y_LET} math={`\\text{${letters[1]}}`} fontSize={18} />
      </Fade>
      <Fade k={kN}>
        <SvgMath x={x - 18} y={Y_NUM - 10 * (1 - kN)} math={String(nums[0])} fontSize={16} />
        <SvgMath x={x + 18} y={Y_NUM - 10 * (1 - kN)} math={String(nums[1])} fontSize={16} />
        <path
          d={`M ${x - 32} ${Y_NUM + 10} Q ${x} ${Y_NUM + 20} ${x + 32} ${Y_NUM + 10}`}
          fill="none"
          stroke="var(--ifm-color-emphasis-500)"
          strokeWidth={1.2}
        />
      </Fade>
      <DownArrow x={x} y0={Y_A0} y1={Y_A1} k={kA} tone={tone} label={label} />
      <Fade k={kC}>
        <SvgMath x={x} y={Y_COD} math={pairTex(coded)} fontSize={16} tone={tone} />
      </Fade>
    </g>
  );
}

// Uma coluna do que chegou: o par embaixo, seta tracejada para cima, “? ?”.
function ReceivedColumn({x, coded, t0, t}) {
  const kC = stage(t, t0, t0 + 0.4);
  const kA = stage(t, t0 + 0.4, t0 + 1.0);
  const kQ = stage(t, t0 + 1.0, t0 + 1.3);
  return (
    <g>
      <Fade k={kC}>
        <SvgMath x={x} y={Y_COD} math={pairTex(coded)} fontSize={16} tone={2} />
      </Fade>
      <DownArrow x={x} y0={Y_A0 - 10} y1={Y_A1} k={kA} tone={2} dashed up label="?" />
      <Fade k={kQ}>
        <SvgMath x={x - 18} y={Y_LET + 18} math="?" fontSize={18} tone={2} />
        <SvgMath x={x + 18} y={Y_LET + 18} math="?" fontSize={18} tone={2} />
      </Fade>
    </g>
  );
}

// Uma coluna da decodificação: par recebido → seta da inversa → números → letras.
function DecodeColumn({x, coded, nums, t0, t, label}) {
  const kC = stage(t, t0, t0 + 0.3);
  const kA = stage(t, t0 + 0.3, t0 + 0.9);
  const kN = stage(t, t0 + 0.9, t0 + 1.3);
  const kL = stage(t, t0 + 1.3, t0 + 1.7);
  // de cima para baixo: par recebido, seta, números, letras
  const yC = 22;
  const yN = 112;
  const yL = 146;
  return (
    <g>
      <Fade k={kC}>
        <SvgMath x={x} y={yC} math={pairTex(coded)} fontSize={16} tone={2} />
      </Fade>
      <DownArrow x={x} y0={40} y1={92} k={kA} tone={1} label={label} />
      <Fade k={kN}>
        <SvgMath x={x - 18} y={yN} math={String(nums[0])} fontSize={16} tone={1} />
        <SvgMath x={x + 18} y={yN} math={String(nums[1])} fontSize={16} tone={1} />
      </Fade>
      <Fade k={kL}>
        <SvgMath x={x - 18} y={yL - 8 * (1 - kL)} math={`\\text{${letterOf(nums[0])}}`} fontSize={20} />
        <SvgMath x={x + 18} y={yL - 8 * (1 - kL)} math={`\\text{${letterOf(nums[1])}}`} fontSize={20} />
      </Fade>
    </g>
  );
}

function Panel({title, width, height, children, label}) {
  return (
    <div style={{flex: `0 1 ${width}px`, minWidth: 0, maxWidth: `${width}px`, width: '100%'}}>
      <p style={{margin: '0 0 0.3rem', fontSize: '0.88rem', fontWeight: 600, textAlign: 'center'}}>{title}</p>
      <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`} style={{maxWidth: `${width}px`}} role="img" aria-label={label}>
        {children}
      </svg>
    </div>
  );
}

export default function InverseCipher({
  mode = 'encode',
  word = 'PAGO',
  matrix = [
    [2, 1],
    [1, 1],
  ],
  inverse = [
    [1, -1],
    [-1, 2],
  ],
  received = [],
  words = ['AB', 'CA'],
  matrixLabel = 'A',
  inverseLabel = 'A^{-1}',
  exampleTitle,
  receivedTitle = 'Chegou hoje',
  replayLabel = 'Ver de novo',
  caption,
}) {
  const times = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
  const toNums = (w) => w.split('').map((ch) => ch.charCodeAt(0) - 64);
  const pairsOf = (arr) => {
    const out = [];
    for (let i = 0; i < arr.length; i += 2) out.push([arr[i], arr[i + 1]]);
    return out;
  };

  let duration = 0.3 + (word.length / 2) * 1.0 + 1.0 + Math.max(0, received.length - 1) * 0.25 + 1.4;
  if (mode === 'decode') duration = 0.3 + received.length * 1.1 + 1.6;
  if (mode === 'ambiguous') duration = 4.2;
  const {ref, t, play, playing} = useAnimation({duration});
  const H = 160;

  let body = null;
  if (mode === 'encode') {
    const pairs = pairsOf(toNums(word));
    const wA = PADX * 2 + pairs.length * COL;
    const wB = PADX * 2 + received.length * COL;
    const tB = 0.3 + pairs.length * 1.0 + 1.0;
    body = (
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem 1.5rem', justifyContent: 'center', width: '100%'}}>
        <Panel title={exampleTitle ?? `Exemplo: ${word}`} width={wA} height={H} label={`A palavra ${word} codificada pela matriz`}>
          {pairs.map((p, i) => (
            <EncodeColumn
              key={i}
              x={PADX + COL * (i + 0.5)}
              letters={[letterOf(p[0]), letterOf(p[1])]}
              nums={p}
              coded={times(matrix, p)}
              t0={0.3 + i * 1.0}
              t={t}
              label={matrixLabel}
            />
          ))}
        </Panel>
        <Panel title={receivedTitle} width={wB} height={H} label="Os pares que chegaram, com pontos de interrogação no lugar das letras">
          {received.map((p, i) => (
            <ReceivedColumn key={i} x={PADX + COL * (i + 0.5)} coded={p} t0={tB + i * 0.25} t={t} />
          ))}
        </Panel>
      </div>
    );
  } else if (mode === 'decode') {
    const w = PADX * 2 + received.length * COL;
    const decoded = received.map((p) => times(inverse, p));
    const kW = stage(t, 0.3 + received.length * 1.1 + 0.6, duration);
    const wordStr = decoded.flat().map(letterOf).join('');
    body = (
      <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <Panel title="Decodificar com a inversa" width={w} height={H + 40} label={`Os pares recebidos decodificados pela inversa formam a palavra ${wordStr}`}>
          {received.map((p, i) => (
            <DecodeColumn key={i} x={PADX + COL * (i + 0.5)} coded={p} nums={decoded[i]} t0={0.3 + i * 1.1} t={t} label={inverseLabel} />
          ))}
          <Fade k={kW}>
            <rect x={PADX + 8} y={H + 2} width={w - 2 * PADX - 16} height={32} rx={6} fill="var(--mv-tone-3)" fillOpacity={0.14} stroke="var(--mv-tone-3)" strokeWidth={1.6} />
            <SvgMath x={w / 2} y={H + 18} math={`\\text{${wordStr}}`} fontSize={20} tone={3} />
          </Fade>
        </Panel>
      </div>
    );
  } else {
    // ambiguous
    const nums = words.map((wd) => toNums(wd));
    const imgs = nums.map((p) => times(matrix, p));
    const w = PADX * 2 + 2 * COL + 120;
    const xs = [PADX + 30 + COL * 0.5, w - PADX - 30 - COL * 0.5];
    const mid = w / 2;
    const yTop = 22;
    const yNum = 54;
    const yImg = 150;
    const k1 = stage(t, 0.2, 0.6);
    const k2 = stage(t, 0.6, 1.1);
    const k3 = stage(t, 1.1, 2.1);
    const k4 = stage(t, 2.1, 2.5);
    const k5 = stage(t, 2.8, 3.8);
    const lineTo = (x0, y0, x1, y1, k, tone, dashed) => {
      const x = x0 + (x1 - x0) * k;
      const y = y0 + (y1 - y0) * k;
      const len = Math.hypot(x - x0, y - y0);
      if (len < 3) return null;
      const ux = (x - x0) / len;
      const uy = (y - y0) / len;
      const color = `var(--mv-tone-${tone})`;
      return (
        <g>
          <line x1={x0} y1={y0} x2={x - ux * 7} y2={y - uy * 7} stroke={color} strokeWidth={2.2} strokeDasharray={dashed ? '5 4' : undefined} />
          <path d={`M ${x} ${y} L ${x - ux * 10 - uy * 5} ${y - uy * 10 + ux * 5} L ${x - ux * 10 + uy * 5} ${y - uy * 10 - ux * 5} Z`} fill={color} />
        </g>
      );
    };
    body = (
      <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <Panel title={`Duas palavras, a matriz ${matrixLabel}`} width={w} height={H + 10} label="Duas palavras diferentes chegam ao mesmo par">
          {words.map((wd, i) => (
            <g key={wd}>
              <Fade k={k1}>
                <SvgMath x={xs[i] - 18} y={yTop} math={`\\text{${wd[0]}}`} fontSize={18} tone={i + 1} />
                <SvgMath x={xs[i] + 18} y={yTop} math={`\\text{${wd[1]}}`} fontSize={18} tone={i + 1} />
              </Fade>
              <Fade k={k2}>
                <SvgMath x={xs[i]} y={yNum} math={pairTex(nums[i])} fontSize={16} tone={i + 1} />
              </Fade>
              {lineTo(xs[i], yNum + 14, mid + (i === 0 ? -6 : 6), yImg - 16, k3, i + 1, false)}
            </g>
          ))}
          {k3 > 0.6 && <SvgMath x={mid} y={(yNum + yImg) / 2 - 4} math={matrixLabel} fontSize={16} />}
          <Fade k={k4}>
            <rect x={mid - 40} y={yImg - 14} width={80} height={28} rx={6} fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
            <SvgMath x={mid} y={yImg} math={pairTex(imgs[0])} fontSize={16} />
          </Fade>
          {k5 > 0 && (
            <g>
              {lineTo(mid - 44, yImg, xs[0] - 34, yNum + 10, k5, 1, true)}
              {lineTo(mid + 44, yImg, xs[1] + 34, yNum + 10, k5, 2, true)}
              {k5 > 0.7 && (
                <>
                  <SvgMath x={(mid - 44 + xs[0] - 34) / 2 - 18} y={(yImg + yNum) / 2 + 10} math="?" fontSize={20} />
                  <SvgMath x={(mid + 44 + xs[1] + 34) / 2 + 18} y={(yImg + yNum) / 2 + 10} math="?" fontSize={20} />
                </>
              )}
            </g>
          )}
        </Panel>
      </div>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="inverse-cipher">
      <figure className={styles.figure} ref={ref}>
        {body}
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
