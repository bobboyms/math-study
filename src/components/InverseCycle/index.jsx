import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath, onCircle} from '../mathviz/useAnimation';

// Onde cada inversa procura a resposta, no ciclo trigonométrico.
//
// `fn` escolhe a inversa:
// - 'sen': a reta horizontal y = v corta o ciclo em dois pontos. O arcsen
//   devolve o da metade direita (de −90° a 90°, arco grosso); o outro,
//   180° − α, fica na metade esquerda.
// - 'cos': a reta vertical x = v. O arccos devolve o ponto da metade de cima
//   (de 0° a 180°); o outro é −α, na metade de baixo.
// - 'tg': a reta do raio que passa pela altura v da reta x = 1. Ela passa por
//   dois pontos do ciclo; o arctg devolve o da metade direita, sem as pontas
//   (de −90° a 90°, abertos); o outro é α + 180°.
//
// O ponto devolvido sai no tom 1, com o arco do giro; o outro, no tom 2, vazio.
// Ao aparecer, o valor v corre do mínimo até `initial`: o ponto devolvido
// percorre a metade destacada sem nunca repetir uma posição.

const W = 380;
const H = 330;
const CX = 176;
const CY = 165;
const R = 112;
const D = Math.PI / 180;
const CLAMP = 1.3; // altura máxima de T desenhada, em raios

const CONF = {
  sen: {
    name: '\\arcsen',
    min: -1,
    max: 1,
    step: 0.05,
    half: [-90, 90],
    principal: (v) => Math.asin(v) / D,
    other: (a) => 180 - a,
    otherTex: (a) => `180^\\circ - ${a < 0 ? `(${deg(a)})` : deg(a)} = ${deg(180 - a)}`,
    place: 'metade direita',
    otherPlace: 'metade esquerda',
    what: 'altura',
    valueName: 'Altura v (o seno conhecido)',
  },
  cos: {
    name: '\\arccos',
    min: -1,
    max: 1,
    step: 0.05,
    half: [0, 180],
    principal: (v) => Math.acos(v) / D,
    other: (a) => -a,
    otherTex: (a) => `-${deg(a)}`,
    place: 'metade de cima',
    otherPlace: 'metade de baixo',
    what: 'posição horizontal',
    valueName: 'Posição horizontal v (o cosseno conhecido)',
  },
  tg: {
    name: '\\arctg',
    min: -4,
    max: 4,
    step: 0.1,
    half: [-90, 90],
    principal: (v) => Math.atan(v) / D,
    other: (a) => a + 180,
    otherTex: (a) => `${deg(a)} + 180^\\circ = ${deg(a + 180)}`,
    place: 'metade direita',
    otherPlace: 'metade esquerda',
    what: 'tangente',
    valueName: 'Valor v (a tangente conhecida)',
  },
};

// Ângulo em graus, em LaTeX, com uma casa quando não for inteiro.
function deg(a) {
  const r = Math.round(a * 10) / 10;
  const s = Number.isInteger(r) ? String(r) : r.toFixed(1).replace('.', '{,}');
  return `${s}^\\circ`;
}
const isRound = (a) => Math.abs(a * 10 - Math.round(a * 10)) < 1e-6;

export default function InverseCycle({fn = 'sen', initial, caption}) {
  const c = CONF[fn];
  const start = initial ?? (fn === 'tg' ? 1 : 0.5);
  const [v, setV] = useState(start);
  const {ref, t, play, playing} = useAnimation({duration: 2.6});
  const shown = playing ? c.min + ease(t / 2.6) * (v - c.min) : v;
  const sv = Math.abs(shown) < 1e-9 ? 0 : shown;

  const alpha = c.principal(sv);
  const beta = c.other(alpha);
  const [px, py] = onCircle(CX, CY, R, alpha * D);
  const [qx, qy] = onCircle(CX, CY, R, beta * D);
  const same = Math.hypot(px - qx, py - qy) < 1;

  const vTex = mathNumber(sv, fn === 'tg' ? 1 : 2);
  const vText = vTex.replace('{,}', ',').replace('-', '\u2212');
  const rel = isRound(alpha) ? '=' : '\\approx';

  // a reta que define o valor
  let line;
  let tPoint = null;
  if (fn === 'sen') {
    const y = CY - sv * R;
    line = <line x1={CX - R - 34} y1={y} x2={CX + R + 34} y2={y} stroke="var(--mv-tone-2)" strokeWidth={2} strokeDasharray="6 5" />;
  } else if (fn === 'cos') {
    const x = CX + sv * R;
    line = <line x1={x} y1={CY - R - 30} x2={x} y2={CY + R + 30} stroke="var(--mv-tone-2)" strokeWidth={2} strokeDasharray="6 5" />;
  } else {
    // reta do raio, dos dois lados do centro, até a borda do desenho
    const dx = Math.cos(alpha * D);
    const dy = Math.sin(alpha * D);
    const L = 200;
    line = (
      <line
        x1={CX - dx * L}
        y1={CY + dy * L}
        x2={CX + dx * L}
        y2={CY - dy * L}
        stroke="var(--mv-tone-2)"
        strokeWidth={2}
        strokeDasharray="6 5"
      />
    );
    const inside = Math.abs(sv) <= CLAMP;
    tPoint = {y: CY - Math.max(-CLAMP, Math.min(CLAMP, sv)) * R, inside};
  }

  const [h0, h1] = c.half;
  const labelOut = (a, r = R + 20) => onCircle(CX, CY, r, a * D);
  // Na tangente, a reta tracejada passa pelos dois pontos na direção do raio:
  // o rótulo sai um pouco girado, para não ficar em cima dela.
  const tilt = fn === 'tg' ? -13 : 0;
  const [plx, ply] = labelOut(alpha + tilt);
  const [qlx, qly] = labelOut(beta + tilt);
  const arcR = 30;
  const thetaArc = alpha >= 0 ? arcPath(CX, CY, arcR, 0, alpha * D) : arcPath(CX, CY, arcR, alpha * D, 0);

  return (
    <div className={shared.wrapper} data-explorer={`inverse-cycle-${fn}`}>
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Ciclo trigonométrico: o ponto que a função ${fn === 'sen' ? 'arco seno' : fn === 'cos' ? 'arco cosseno' : 'arco tangente'} devolve fica na ${c.place}.`}
        >
          <line x1={CX - R - 34} y1={CY} x2={CX + R + 34} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
          <line x1={CX} y1={CY - R - 30} x2={CX} y2={CY + R + 30} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />

          {/* a metade em que a inversa procura a resposta */}
          <path
            d={arcPath(CX, CY, R, h0 * D, h1 * D)}
            fill="none"
            stroke="var(--mv-tone-1)"
            strokeWidth={9}
            strokeOpacity={0.3}
            strokeLinecap={fn === 'tg' ? 'butt' : 'round'}
          />
          {fn === 'tg' &&
            [h0, h1].map((a) => {
              const [x, y] = onCircle(CX, CY, R, a * D);
              return <circle key={a} cx={x} cy={y} r={5} fill="var(--mv-paper)" stroke="var(--mv-tone-1)" strokeWidth={2} />;
            })}

          {fn === 'tg' && (
            <line x1={CX + R} y1={CY - CLAMP * R - 8} x2={CX + R} y2={CY + CLAMP * R + 8} stroke="var(--mv-guide)" strokeWidth={1.5} />
          )}

          {line}

          {/* o outro ponto: também resolve, mas não é devolvido */}
          {!same && (
            <>
              <line x1={CX} y1={CY} x2={qx} y2={qy} stroke="var(--mv-tone-2)" strokeWidth={2} strokeDasharray="6 4" />
              <circle cx={qx} cy={qy} r={6} fill="var(--mv-paper)" stroke="var(--mv-tone-2)" strokeWidth={2.5} />
              <SvgMath
                x={qlx}
                y={qly}
                math={deg(beta)}
                anchor={Math.cos(beta * D) > 0.3 ? 'start' : Math.cos(beta * D) < -0.3 ? 'end' : 'middle'}
                space={Math.cos(beta * D) < -0.3 ? qlx : W - qlx}
                tone={2}
                fontSize={13}
                halo
              />
            </>
          )}

          {/* o ponto devolvido */}
          {Math.abs(alpha) > 0.5 && <path d={thetaArc} fill="none" stroke="var(--mv-tone-1)" strokeWidth={2} />}
          <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={px} cy={py} r={6} fill="var(--mv-tone-1)" />
          <SvgMath
            x={plx}
            y={ply}
            math={deg(alpha)}
            anchor={Math.cos(alpha * D) > 0.3 ? 'start' : Math.cos(alpha * D) < -0.3 ? 'end' : 'middle'}
            space={Math.cos(alpha * D) < -0.3 ? plx : W - plx}
            tone={1}
            fontSize={13}
            halo
          />

          {tPoint && (
            <>
              {tPoint.inside && <circle cx={CX + R} cy={tPoint.y} r={5} fill="var(--mv-tone-2)" />}
              {tPoint.inside && (
                <SvgMath x={CX + R + 10} y={tPoint.y + (sv >= 0 ? -12 : 12)} math="T" anchor="start" tone={2} fontSize={13} halo />
              )}
            </>
          )}
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />
        </svg>
        {caption && <figcaption className={geo.caption}>{caption}</figcaption>}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`${c.name}(${vTex}) ${rel} ${deg(alpha)}`} />
          {' '}
          (<Formula math={`\\approx ${mathNumber(alpha * D, 2)}`} /> rad).
        </p>
        <p>
          {same ? (
            fn === 'sen' ? (
              <>Com v = {vText}, a reta só encosta no ciclo num ponto. Há um único giro na primeira volta, e é ele que a função devolve.</>
            ) : (
              <>Com v = {vText}, a reta só encosta no ciclo num ponto. Há um único giro, e é ele que a função devolve.</>
            )
          ) : fn === 'tg' ? (
            <>
              A reta do raio que passa por T corta o ciclo em dois pontos. O arctg devolve o da {c.place}. O outro,{' '}
              <Formula math={c.otherTex(alpha)} />, tem a mesma tangente, mas fica na {c.otherPlace}.
            </>
          ) : (
            <>
              Dois pontos do ciclo têm {c.what} {vText}. A função devolve o da {c.place}. O outro,{' '}
              <Formula math={c.otherTex(alpha)} />, também resolve a equação, mas fica na {c.otherPlace}.
            </>
          )}
          {fn === 'tg' && tPoint && !tPoint.inside && ' O ponto T está fora da parte desenhada da reta x = 1.'}
        </p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            {c.valueName}: {vText}
          </span>
          <input
            type="range"
            min={c.min}
            max={c.max}
            step={c.step}
            value={v}
            onChange={(event) => setV(Number(event.target.value))}
            disabled={playing}
            aria-label={c.valueName}
            aria-valuetext={vText}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Ver a varredura de novo
        </button>
      </div>
    </div>
  );
}
