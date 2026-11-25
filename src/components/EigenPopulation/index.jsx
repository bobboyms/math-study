import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {num, numText} from '../EigenGridMorph/eigen';

// A população entre a cidade e o campo, ano a ano (lição 11.11).
//
// Regra de um ano: 10% da cidade vai para o campo e 20% do campo vai para a
// cidade. Total de 900 mil pessoas.
//
// mode="problem" (motivador): o diagrama das duas regiões, com as setas das
// mudanças do ano, e o gráfico ano a ano. Anima os anos 0 a 4 (a tabela da
// lição); depois o aluno avança com "Mais um ano", até o ano 30.
//
// mode="solved" (resolução): o mesmo gráfico com as linhas do equilíbrio
// (600 mil e 300 mil) e, ao lado, cada ano como um ponto (cidade, campo) em
// centenas de milhares, andando pela reta do total 9 na direção de (1, −1)
// até o equilíbrio (6, 3), que está na reta de (2, 1). O deslizante troca a
// população inicial da cidade: o ponto de chegada é sempre o mesmo.

const TOTAL = 900;
const step = ([c, r]) => [0.9 * c + 0.2 * r, 0.1 * c + 0.8 * r];

function series(c0, n) {
  const out = [[c0, TOTAL - c0]];
  for (let k = 1; k <= n; k += 1) out.push(step(out[k - 1]));
  return out;
}

const T = (v, d = 2) => numText(v, d);
const eq = (v) => (Math.abs(v - Number(v.toFixed(2))) < 1e-9 ? '=' : '\\approx');
const axisText = {fontSize: 11, fill: 'var(--ifm-color-emphasis-800)'};

function TimeChart({data, year, xMax, solved}) {
  const W = 440;
  const H = 250;
  const x0 = 44;
  const x1 = W - 70;
  const y0 = 14;
  const y1 = H - 34;
  const X = (k) => x0 + ((x1 - x0) * k) / xMax;
  const top = solved ? 900 : 700;
  const Y = (v) => y0 + ((y1 - y0) * (top - v)) / top;
  const xt = [];
  const stepX = xMax <= 10 ? 1 : 5;
  for (let k = 0; k <= xMax; k += stepX) xt.push(k);
  const shown = data.slice(0, year + 1);
  const pts = (i) => shown.map((p, k) => `${X(k).toFixed(1)} ${Y(p[i]).toFixed(1)}`).join(' L ');
  const last = shown[shown.length - 1];
  // Quando as duas curvas se cruzam, os rótulos da ponta se afastam para não
  // cair um em cima do outro; quem está mais alto fica com o rótulo de cima.
  const labelY = [Y(last[0]), Y(last[1])];
  const gap = 14 - Math.abs(labelY[0] - labelY[1]);
  if (gap > 0) {
    const up = labelY[0] <= labelY[1] ? 0 : 1;
    labelY[up] -= gap / 2;
    labelY[1 - up] += gap / 2;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`, width: '100%'}} role="img" aria-label="População da cidade e do campo, em milhares, ano a ano">
      {(solved ? [0, 100, 200, 300, 400, 500, 600, 700, 800, 900] : [0, 100, 200, 300, 400, 500, 600, 700]).map((v) => (
        <g key={v}>
          <line x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
          <text x={x0 - 6} y={Y(v) + 4} textAnchor="end" {...axisText}>
            {v}
          </text>
        </g>
      ))}
      {xt.map((k) => (
        <text key={k} x={X(k)} y={y1 + 15} textAnchor="middle" {...axisText}>
          {k}
        </text>
      ))}
      <text x={x1} y={H - 2} textAnchor="end" {...axisText}>
        ano
      </text>
      <text x={x0 - 6} y={8} textAnchor="start" {...axisText}>
        mil pessoas
      </text>
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      {solved && (
        <g>
          <line x1={x0} y1={Y(600)} x2={x1} y2={Y(600)} stroke="var(--mv-tone-1)" strokeWidth={1.4} strokeDasharray="6 4" />
          <line x1={x0} y1={Y(300)} x2={x1} y2={Y(300)} stroke="var(--mv-tone-2)" strokeWidth={1.4} strokeDasharray="6 4" />
        </g>
      )}
      <path d={`M ${pts(0)}`} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.4} opacity={0.6} />
      <path d={`M ${pts(1)}`} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.4} opacity={0.6} />
      {shown.map((p, k) => (
        <g key={k}>
          <circle cx={X(k)} cy={Y(p[0])} r={xMax > 10 ? 2.6 : 4} fill="var(--mv-tone-1)" />
          <circle cx={X(k)} cy={Y(p[1])} r={xMax > 10 ? 2.6 : 4} fill="var(--mv-tone-2)" />
        </g>
      ))}
      <text x={x1 + 6} y={labelY[0] + 4} fill="var(--mv-tone-1)" fontSize={12} fontWeight={600}>
        cidade
      </text>
      <text x={x1 + 6} y={labelY[1] + 4} fill="var(--mv-tone-2)" fontSize={12} fontWeight={600}>
        campo
      </text>
    </svg>
  );
}

function FlowDiagram({pop}) {
  const [c, r] = pop;
  const W = 440;
  const H = 170;
  const bx = [30, 290];
  const bw = 120;
  const bh = 110;
  const by = 36;
  const level = (v) => (bh * v) / TOTAL;
  const box = (x, v, tone, title) => (
    <g>
      <rect x={x} y={by} width={bw} height={bh} rx={8} fill="none" stroke={`var(--mv-tone-${tone})`} strokeWidth={2} />
      <rect x={x + 2} y={by + bh - level(v)} width={bw - 4} height={Math.max(0, level(v) - 2)} rx={6} fill={`var(--mv-tone-${tone})`} fillOpacity={0.25} />
      <text x={x + bw / 2} y={by - 10} textAnchor="middle" fontSize={14} fontWeight={600} fill={`var(--mv-tone-${tone})`}>
        {title}
      </text>
      <text x={x + bw / 2} y={by + bh / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--ifm-font-color-base)">
        {T(v)} mil
      </text>
    </g>
  );
  const ax0 = bx[0] + bw + 8;
  const ax1 = bx[1] - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`, width: '100%'}} role="img" aria-label="Cidade e campo, com as mudanças de um ano">
      <defs>
        <marker id="eigpop-head1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="var(--mv-tone-1)" />
        </marker>
        <marker id="eigpop-head2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="var(--mv-tone-2)" />
        </marker>
      </defs>
      {box(bx[0], c, 1, 'Cidade')}
      {box(bx[1], r, 2, 'Campo')}
      <line x1={ax0} y1={by + 30} x2={ax1} y2={by + 30} stroke="var(--mv-tone-1)" strokeWidth={2.4} markerEnd="url(#eigpop-head1)" />
      <text x={(ax0 + ax1) / 2} y={by + 22} textAnchor="middle" fontSize={12} fill="var(--ifm-font-color-base)">
        10%: {T(0.1 * c)} mil
      </text>
      <line x1={ax1} y1={by + 80} x2={ax0} y2={by + 80} stroke="var(--mv-tone-2)" strokeWidth={2.4} markerEnd="url(#eigpop-head2)" />
      <text x={(ax0 + ax1) / 2} y={by + 100} textAnchor="middle" fontSize={12} fill="var(--ifm-font-color-base)">
        20%: {T(0.2 * r)} mil
      </text>
    </svg>
  );
}

function PlanePanel({data, year}) {
  const u = 27;
  const pad = 30;
  const W = pad * 2 + 9 * u + 10;
  const H = pad * 2 + 9 * u;
  const X = (x) => pad + x * u;
  const Y = (y) => pad + (9 - y) * u;
  const shown = data.slice(0, year + 1).map(([c, r]) => [c / 100, r / 100]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`, width: '100%'}} role="img" aria-label="Cada ano como um ponto (cidade, campo), em centenas de milhares">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
        <g key={k}>
          <line x1={X(k)} y1={Y(0)} x2={X(k)} y2={Y(9)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
          <line x1={X(0)} y1={Y(k)} x2={X(9)} y2={Y(k)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
          {k % 3 === 0 && k > 0 && (
            <>
              <text x={X(k)} y={Y(0) + 14} textAnchor="middle" {...axisText}>
                {k}
              </text>
              <text x={X(0) - 6} y={Y(k) + 4} textAnchor="end" {...axisText}>
                {k}
              </text>
            </>
          )}
        </g>
      ))}
      <line x1={X(0)} y1={Y(0)} x2={X(9)} y2={Y(0)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(9)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      <line x1={X(0)} y1={Y(9)} x2={X(9)} y2={Y(0)} stroke="var(--mv-guide)" strokeWidth={1.4} strokeDasharray="5 4" />
      <line x1={X(0)} y1={Y(0)} x2={X(9)} y2={Y(4.5)} stroke="var(--mv-tone-1)" strokeWidth={1.6} strokeDasharray="7 5" />
      {shown.map((p, k) => (
        <circle key={k} cx={X(p[0])} cy={Y(p[1])} r={k === shown.length - 1 ? 5 : 3.6} fill="var(--mv-tone-2)" opacity={k === shown.length - 1 ? 1 : 0.6} />
      ))}
      <circle cx={X(6)} cy={Y(3)} r={5.5} fill="none" stroke="var(--mv-tone-1)" strokeWidth={2.2} />
      <SvgMath x={X(6) + 8} y={Y(3) - 16} anchor="start" math="(6,\ 3)" fontSize={13} tone={1} halo />
      <SvgMath x={X(9) - 4} y={Y(4.5) - 14} anchor="end" math="\text{reta de } (2,\ 1)" fontSize={12} tone={1} halo />
      <SvgMath x={X(0.6)} y={Y(8.4) - 2} anchor="start" math="\text{total } 9" fontSize={12} halo />
      <text x={X(9)} y={H - 2} textAnchor="end" {...axisText}>
        cidade
      </text>
      <text x={X(0) + 4} y={12} textAnchor="start" {...axisText}>
        campo
      </text>
    </svg>
  );
}

export default function EigenPopulation({mode = 'problem', caption}) {
  const solved = mode === 'solved';
  const animYears = solved ? 10 : 4;
  const [c0, setC0] = useState(300);
  const [year, setYear] = useState(animYears);
  const [manual, setManual] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: solved ? 5 : 4.5, onFrame: () => setManual(false)});

  const total = solved ? 5 : 4.5;
  const animY = Math.min(animYears, Math.floor((t / total) * (animYears + 1)));
  const y = playing ? animY : manual ? year : animYears;
  const data = series(solved ? c0 : 300, 30);
  const xMax = y <= 10 ? 10 : 30;
  const cur = data[y];
  const prev = y > 0 ? data[y - 1] : null;
  const diff = c0 - 600;

  return (
    <div className={shared.wrapper} data-explorer="eigen-population">
      <figure className={styles.figure} ref={ref}>
        <div className={styles.row}>
          {solved ? <TimeChart data={data} year={y} xMax={xMax} solved /> : <FlowDiagram pop={cur} />}
          {solved ? <PlanePanel data={data} year={y} /> : <TimeChart data={data} year={y} xMax={xMax} />}
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      {solved && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>
              População inicial da cidade: <strong>{c0} mil</strong> (campo: {TOTAL - c0} mil)
            </span>
            <input
              type="range"
              min={0}
              max={900}
              step={50}
              value={c0}
              disabled={playing}
              onChange={(e) => {
                setC0(Number(e.target.value));
                setYear(10);
                setManual(true);
              }}
              aria-label="População inicial da cidade, em milhares"
            />
          </label>
        </div>
      )}
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {solved ? (
          <>
            <p className={shared.formula}>
              <Formula math={`\\text{cidade no ano } k = 600 ${diff < 0 ? '-' : '+'} ${Math.abs(diff)} \\times 0{,}7^k`} />
            </p>
            <p className={shared.formula}>
              <Formula math={`\\text{campo no ano } k = 300 ${diff < 0 ? '+' : '-'} ${Math.abs(diff)} \\times 0{,}7^k`} />
            </p>
            <p>
              Ano {y}: cidade {T(cur[0])} mil, campo {T(cur[1])} mil. A distância até o equilíbrio (600 mil e 300 mil) é de{' '}
              {T(Math.abs(cur[0] - 600))} mil
              {diff === 0 ? ': a população já começou no equilíbrio e não se mexe.' : ', e a cada ano ela vira 70% do que era.'}
            </p>
          </>
        ) : y === 0 ? (
          <p>Ano 0: 300 mil na cidade e 600 mil no campo, 900 mil ao todo.</p>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\text{cidade} = 0{,}9 \\times ${num(prev[0], 2)} + 0{,}2 \\times ${num(prev[1], 2)} ${eq(cur[0])} ${num(cur[0], 2)}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula
                math={`\\text{campo} = 0{,}1 \\times ${num(prev[0], 2)} + 0{,}8 \\times ${num(prev[1], 2)} ${eq(cur[1])} ${num(cur[1], 2)}`}
              />
            </p>
            <p>
              Ano {y}: a cidade ganhou {T(cur[0] - prev[0])} mil pessoas neste ano. O total continua {T(cur[0] + cur[1], 0)} mil.
            </p>
          </>
        )}
      </div>
      <div className={shared.buttons}>
        {!solved && (
          <>
            <button
              type="button"
              disabled={playing || y >= 30}
              onClick={() => {
                setYear(Math.min(30, y + 1));
                setManual(true);
              }}
            >
              Mais um ano
            </button>
            <button
              type="button"
              disabled={playing}
              onClick={() => {
                setYear(0);
                setManual(true);
              }}
            >
              Voltar ao ano 0
            </button>
          </>
        )}
        {solved && (
          <button
            type="button"
            disabled={playing}
            onClick={() => {
              setYear(Math.min(30, y + 1));
              setManual(true);
            }}
          >
            Mais um ano
          </button>
        )}
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setManual(false);
            play();
          }}
        >
          Ver os anos de novo
        </button>
      </div>
    </div>
  );
}
