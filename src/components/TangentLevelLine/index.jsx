import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// Quantas vezes a tangente atinge uma altura c?
//
// Três ramos inteiros da tangente, de −π/2 a 5π/2, e a reta horizontal y = c,
// controlada por um deslizante. Cada ramo sobe de baixo até em cima, então a
// reta corta cada ramo exatamente uma vez, para qualquer c, e os cortes ficam
// a π um do outro. Botões levam c a valores grandes (a reta sai do desenho,
// mas os cortes continuam existindo, encostados nas assíntotas).
//
// O botão "comparar com o seno" acrescenta o seno tracejado e os cortes dele:
// para c entre −1 e 1 há cortes; fora disso, nenhum. É o contraste entre a
// imagem da tangente (todos os reais) e a do seno.

const A = -Math.PI / 2;
const B = (5 * Math.PI) / 2;
const Y_MAX = 4.5;

const fmtX = (x) => mathNumber(Math.abs(x) < 1e-12 ? 0 : x, 2);

function tangentCuts(c) {
  const base = Math.atan(c);
  return [0, 1, 2].map((k) => base + k * Math.PI);
}

function sineCuts(c) {
  if (Math.abs(c) > 1) return [];
  const s = Math.asin(c);
  const out = [];
  for (let k = -1; k <= 2; k += 1) {
    [s + 2 * k * Math.PI, Math.PI - s + 2 * k * Math.PI].forEach((x) => {
      if (x >= A - 1e-9 && x <= B + 1e-9 && !out.some((y) => Math.abs(y - x) < 1e-9)) out.push(x);
    });
  }
  return out.sort((p, q) => p - q);
}

export default function TangentLevelLine({initial = 1, presets = [-2, 0, 1, 3, 10, 1000], caption}) {
  const [c, setC] = useState(initial);
  const [sine, setSine] = useState(false);
  const cuts = tangentCuts(c);
  const sCuts = sine ? sineCuts(c) : [];
  const visible = Math.abs(c) <= Y_MAX;

  const xTicks = [
    [-0.5, '-\\frac{\\pi}{2}'],
    [0.5, '\\frac{\\pi}{2}'],
    [1, '\\pi'],
    [1.5, '\\frac{3\\pi}{2}'],
    [2, '2\\pi'],
    [2.5, '\\frac{5\\pi}{2}'],
  ].map(([k, label]) => ({at: k * Math.PI, label}));

  return (
    <div className={shared.wrapper} data-explorer="tangent-level-line">
      <CartesianPlane
        xMin={A - 0.25}
        xMax={B + 0.25}
        yMin={-Y_MAX}
        yMax={Y_MAX}
        xUnit={40}
        yUnit={30}
        xStep={Math.PI / 2}
        yStep={1}
        xTicks={xTicks}
        functions={[
          {f: Math.tan, tone: 1, domain: [A + 1e-3, B - 1e-3]},
          ...(sine ? [{f: Math.sin, tone: 3, dashed: true}] : []),
        ]}
        lines={[
          ...[-0.5, 0.5, 1.5, 2.5].map((k) => ({x: k * Math.PI, dashed: true, muted: true})),
          ...(visible ? [{m: 0, n: c, tone: 2}] : []),
        ]}
        points={[
          ...(visible ? cuts.map((x) => ({at: [x, c], tone: 2})) : []),
          ...sCuts.map((x) => ({at: [x, c], tone: 3, r: 4})),
        ]}
        caption={
          caption ??
          'Três ramos inteiros da tangente e a reta horizontal y = c. Arraste c: a reta corta cada ramo uma vez, qualquer que seja c.'
        }
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          A reta <Formula math={`y = ${mathNumber(c, 1)}`} /> corta a tangente <strong>3 vezes</strong> neste trecho, uma
          em cada ramo:{' '}
          <Formula math={`x \\approx ${cuts.map(fmtX).join(';\\ ')}`} />. Cada corte é o anterior mais{' '}
          <Formula math="\pi \approx 3{,}14" />.
          {!visible &&
            ` A reta passa ${c > 0 ? 'acima' : 'abaixo'} da parte desenhada, e os cortes ficam colados nas assíntotas, mas existem.`}
        </p>
        {sine && (
          <p>
            Seno (tracejado):{' '}
            {sCuts.length === 0
              ? `nenhum corte. O seno nunca passa de 1 nem fica abaixo de −1, e ${mathNumber(c, 1).replace('{,}', ',').replace('-', '−')} está fora desse intervalo.`
              : `${sCuts.length} ${sCuts.length === 1 ? 'corte' : 'cortes'} neste trecho.`}
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Altura c: {String(c).replace('.', ',').replace('-', '−')}</span>
          <input
            type="range"
            min={-4}
            max={4}
            step={0.1}
            value={Math.max(-4, Math.min(4, c))}
            onChange={(event) => setC(Number(event.target.value))}
            aria-label="Altura c da reta horizontal"
            aria-valuetext={`${c}`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setC(p)}>
            c = {String(p).replace('-', '−')}
          </button>
        ))}
        <button type="button" onClick={() => setSine((v) => !v)} aria-pressed={sine}>
          {sine ? 'Esconder o seno' : 'Comparar com o seno'}
        </button>
      </div>
    </div>
  );
}
