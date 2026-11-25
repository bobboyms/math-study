import React, {useMemo, useState} from 'react';
import shared from '../mathviz/explorer.module.css';
import styles from '../LinearGridMorph/styles.module.css';
import {layersSum, svdN} from '../SvdCircleMorph/svd';
import {gray} from '../SvdOuterProduct';
import foto from './foto.json';

// A imagem como matriz de brilhos, refeita com k camadas (lição 11.13).
//
// Três quadros: a imagem original, a soma das k primeiras camadas
// σ1 u1 v1ᵀ + ... + σk uk vkᵀ, e o erro (o que falta: laranja onde a original
// é mais clara, azul onde é mais escura). O deslizante escolhe k. Embaixo, o
// gráfico da soma dos quadrados do erro para cada k, com o k escolhido em
// destaque. O painel conta os números guardados, k × (1 + m + n), contra os
// m × n da imagem, e mostra que o erro é a soma dos σ² descartados.
//
// `image="foto"` usa a foto 32 × 32 (casa, sol e montanha) de `foto.json`.
// `matrixWords` troca “pixels” por “entradas” e esconde a conta dos números
// guardados (para uma matriz pequena, como a 2 × 2 da lição).
// `only="original"` mostra só a imagem, com os números e as casas de
// `highlight` contornadas (problema motivador). `naive` acrescenta o botão
// que compara com guardar os `naive` pixels mais claros e zerar os outros.

const fmt = (x, d = 2) => {
  const r = Number(x.toFixed(d));
  return String(Object.is(r, -0) ? 0 : r).replace('.', ',').replace('-', '−');
};
const thousands = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function Grid({M, cell, showValues, maxValue, signed, highlight = [], digits = 2, title}) {
  const m = M.length;
  const n = M[0].length;
  const W = n * cell + 2;
  const H = m * cell + 2;
  const scale = maxValue / 3;
  return (
    <div style={{display: 'grid', justifyItems: 'center', gap: '0.3rem', flex: '1 1 200px', minWidth: 0}}>
      <div style={{fontSize: '0.88rem', fontWeight: 600, textAlign: 'center'}}>{title}</div>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={title}>
        {M.map((row, i) =>
          row.map((v, j) => {
            let fill;
            let text;
            let opacity = 1;
            if (signed) {
              const a = Math.min(1, Math.abs(v) / scale);
              fill = v >= 0 ? 'var(--mv-tone-2)' : 'var(--mv-tone-1)';
              opacity = Math.abs(v) < 0.005 ? 0 : 0.12 + 0.88 * a;
              text = 'var(--ifm-font-color-base)';
            } else {
              const g = gray(v, maxValue);
              fill = g.fill;
              text = g.text;
            }
            return (
              <g key={`${i}-${j}`}>
                {signed && <rect x={1 + j * cell} y={1 + i * cell} width={cell} height={cell} fill="var(--ifm-background-surface-color)" />}
                <rect
                  x={1 + j * cell}
                  y={1 + i * cell}
                  width={cell}
                  height={cell}
                  fill={fill}
                  fillOpacity={opacity}
                  stroke={showValues ? 'var(--ifm-color-emphasis-400)' : 'none'}
                  strokeWidth={1}
                />
                {showValues && (
                  <text x={1 + j * cell + cell / 2} y={1 + i * cell + cell / 2 + 4.5} textAnchor="middle" fontSize={cell >= 40 ? 12.5 : 11} fill={text}>
                    {fmt(v, Number.isInteger(v) ? 0 : digits)}
                  </text>
                )}
              </g>
            );
          }),
        )}
        {signed && <rect x={1} y={1} width={n * cell} height={m * cell} fill="none" stroke="var(--ifm-color-emphasis-400)" strokeWidth={1} />}
        {highlight.map(([i, j]) => (
          <rect key={`h${i}-${j}`} x={1 + j * cell + 1.5} y={1 + i * cell + 1.5} width={cell - 3} height={cell - 3} fill="none" stroke="var(--mv-tone-3)" strokeWidth={3} />
        ))}
      </svg>
    </div>
  );
}

export default function SvdImageLayers({
  image = 'foto',
  cell,
  showValues = false,
  maxValue = 9,
  initialK = 1,
  only,
  highlight,
  naive,
  matrixWords = false,
  caption,
}) {
  const M = image === 'foto' ? foto : image;
  const m = M.length;
  const n = M[0].length;
  const size = cell ?? (showValues ? 40 : 7);
  const dec = useMemo(() => svdN(M), [M]);
  const r = dec.s.length;
  const [k, setK] = useState(initialK);
  const [useNaive, setUseNaive] = useState(false);

  const total = M.reduce((acc, row) => acc + row.reduce((a, x) => a + x * x, 0), 0);
  const approx = useMemo(() => layersSum(dec, k, m, n), [dec, k, m, n]);

  // Guardar os `naive` pixels mais claros e zerar os outros.
  const naiveImg = useMemo(() => {
    if (!naive) return null;
    const cells = [];
    M.forEach((row, i) => row.forEach((v, j) => cells.push([v, i, j])));
    cells.sort((a, b) => b[0] - a[0] || a[1] - b[1] || a[2] - b[2]);
    const keep = new Set(cells.slice(0, naive).map(([, i, j]) => `${i}-${j}`));
    return M.map((row, i) => row.map((v, j) => (keep.has(`${i}-${j}`) ? v : 0)));
  }, [M, naive]);

  if (only === 'original') {
    return (
      <div className={shared.wrapper} data-explorer="svd-image-layers">
        <figure className={styles.figure}>
          <div className={styles.row}>
            <Grid M={M} cell={size} showValues={showValues} maxValue={maxValue} highlight={highlight} title={`A miniatura, ${m} × ${n} pixels`} />
          </div>
          {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
        </figure>
      </div>
    );
  }

  const shownApprox = useNaive && naiveImg ? naiveImg : approx;
  const err = M.map((row, i) => row.map((v, j) => v - shownApprox[i][j]));
  const errSum = err.reduce((acc, row) => acc + row.reduce((a, x) => a + x * x, 0), 0);
  const stored = k * (1 + m + n);
  const errAt = (kk) => dec.s.slice(kk).reduce((a, s) => a + s * s, 0);

  // Gráfico do erro para cada k.
  const GW = 520;
  const GH = 150;
  const gx0 = 54;
  const gx1 = GW - 12;
  const gy0 = 14;
  const gy1 = GH - 34;
  const ks = Array.from({length: r + 1}, (_, i) => i);
  const bw = Math.min(46, ((gx1 - gx0) / ks.length) * 0.7);
  const BX = (kk) => gx0 + ((gx1 - gx0) * (kk + 0.5)) / ks.length;
  const top = errAt(Math.min(1, r)) * 1.15 || 1;
  const BY = (e) => gy1 - ((gy1 - gy0) * Math.min(e, top)) / top;
  const textColor = 'var(--ifm-color-emphasis-800)';

  return (
    <div className={shared.wrapper} data-explorer="svd-image-layers">
      <figure className={styles.figure}>
        <div className={styles.row}>
          <Grid M={M} cell={size} showValues={showValues} maxValue={maxValue} title="Original" />
          <Grid
            M={shownApprox}
            cell={size}
            showValues={showValues}
            maxValue={maxValue}
            title={useNaive ? `Os ${naive} pixels mais claros` : k === 1 ? 'Com 1 camada' : `Com ${k} camadas`}
          />
          <Grid M={err} cell={size} showValues={showValues} maxValue={maxValue} signed title="Erro (o que falta)" />
        </div>
        <svg className={styles.svg} viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label="Soma dos quadrados do erro para cada número de camadas">
          <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          {ks.map((kk) => {
            const e = errAt(kk);
            const cut = e > top;
            return (
              <g key={kk}>
                <rect
                  x={BX(kk) - bw / 2}
                  y={BY(e)}
                  width={bw}
                  height={Math.max(gy1 - BY(e), e > 0 ? 1.5 : 0)}
                  fill={kk === k && !useNaive ? 'var(--mv-tone-2)' : 'var(--mv-guide)'}
                  opacity={kk === k && !useNaive ? 1 : 0.6}
                />
                {cut && (
                  <text x={BX(kk) + bw / 2 + 4} y={gy0 + 10} textAnchor="start" fontSize={10} fill={textColor}>
                    {thousands(Math.round(e))} ↑
                  </text>
                )}
                {(ks.length <= 8 || kk % 2 === 0) && (
                  <text x={BX(kk)} y={gy1 + 14} textAnchor="middle" fontSize={11} fill={textColor}>
                    {kk}
                  </text>
                )}
              </g>
            );
          })}
          <text x={gx0 - 6} y={gy1 + 4} textAnchor="end" fontSize={11} fill={textColor}>
            0
          </text>
          <text x={(gx0 + gx1) / 2} y={GH - 3} textAnchor="middle" fontSize={11} fill={textColor}>
            camadas guardadas (a barra é a soma dos quadrados do erro)
          </text>
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Camadas guardadas: <strong>k = {k}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={r}
            step={1}
            value={k}
            onChange={(e) => {
              setK(Number(e.target.value));
              setUseNaive(false);
            }}
            aria-label="Quantas camadas guardar"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        {useNaive ? (
          <p>
            Guardando os {naive} pixels mais claros e zerando os outros {m * n - naive}, a soma dos quadrados do erro é{' '}
            <strong>{fmt(errSum)}</strong>, a soma dos quadrados dos pixels zerados. Ainda seria preciso guardar a posição de cada pixel.
          </p>
        ) : (
          <>
            {!matrixWords && (
              <p>
                Números guardados: {k} × (1 + {m} + {n}) = <strong>{thousands(stored)}</strong>, contra {thousands(m * n)} da imagem
                {stored > m * n ? ' (mais do que a própria imagem: com camadas demais, não há compressão)' : ` (${fmt((100 * stored) / (m * n), 1)}%)`}.
              </p>
            )}
            <p>
              Soma dos quadrados do erro: <strong>{fmt(errSum)}</strong>
              {k < r ? (r - k > 1 ? `, que é a soma dos σ² das ${r - k} camadas descartadas` : ', que é o σ² da camada descartada') : ': nada foi descartado'}
              . A aproximação guarda <strong>{fmt(100 * (1 - errSum / total), 2)}%</strong> da soma dos quadrados {matrixWords ? 'das entradas' : 'dos pixels'} ({thousands(Math.round(total))}).
            </p>
          </>
        )}
      </div>
      {naive && (
        <div className={shared.buttons}>
          <button type="button" className={useNaive ? styles.active : undefined} aria-pressed={useNaive} onClick={() => setUseNaive(!useNaive)}>
            {useNaive ? 'Voltar às camadas' : `Comparar: guardar os ${naive} pixels mais claros`}
          </button>
        </div>
      )}
    </div>
  );
}
