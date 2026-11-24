import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {fmt} from '../mathviz/useAnimation';

// O laser do problema motivador da lição do gráfico da tangente.
//
// Um apontador laser fica a 1 m de uma parede, na altura que a régua chama de
// 0. O feixe começa na horizontal e vai sendo inclinado para cima. Tudo em
// escala: 1 m vale K pixels na horizontal e na vertical, então o ângulo
// desenhado é o ângulo de verdade.
//
// A animação gira o feixe com velocidade constante (o mesmo número de graus a
// cada instante) e deixa na parede uma marca a cada 10°. É essa a ideia da
// figura: giros iguais, subidas cada vez maiores. Depois, o deslizante
// controla o giro, até 180°. Passando de 90°, o feixe se afasta da parede; só
// o prolongamento para trás (tracejado) ainda a cruza, abaixo do laser.

const K = 68; // pixels por metro
const TOP = 3.2; // metros acima do laser desenhados
const BOTTOM = 1.7; // metros abaixo do laser desenhados
const PAD = 22;
const LX = 176; // laser
const WX = LX + K; // parede, 1 m à frente
const W = WX + 92;
const LY = PAD + TOP * K; // altura do laser
const H = LY + BOTTOM * K + PAD;
const DURATION = 4;
const COTA_Y = LY + (BOTTOM - 0.45) * K; // altura da cota de 1 m

const rad = (deg) => (deg * Math.PI) / 180;
const Y = (h) => LY - h * K;

// "=" quando o arredondamento não perde nada (tg 45° = 1); "≈" quando perde.
const rel = (v, digits) => (Math.abs(v - Number(v.toFixed(digits))) < 1e-9 ? '=' : '\\approx');

// Onde o raio que sai do laser na direção `deg` cruza a borda do desenho.
function rayEnd(deg, back = false) {
  const a = rad(deg);
  let dx = Math.cos(a);
  let dy = Math.sin(a);
  if (back) {
    dx = -dx;
    dy = -dy;
  }
  const limits = [];
  if (dx > 1e-9) limits.push((W - 8 - LX) / dx);
  if (dx < -1e-9) limits.push((8 - LX) / dx);
  if (dy > 1e-9) limits.push((LY - (PAD - 6)) / dy);
  if (dy < -1e-9) limits.push((LY - (H - PAD + 6)) / dy);
  const s = Math.min(...limits);
  return [LX + dx * s, LY - dy * s];
}

export default function LaserWall({
  initial = 80,
  max = 180,
  presets = [45, 60, 80, 85, 89, 90, 135],
  caption = 'O laser está a 1 m da parede, na altura 0 da régua. As marcas da parede foram deixadas pelo ponto luminoso a cada 10° de giro.',
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  // Velocidade constante, sem suavizar: giros iguais em tempos iguais.
  const shown = playing ? (t / DURATION) * deg : deg;

  const a = rad(shown);
  // O painel escreve o giro arredondado; entre 89,5° e 90,5° ele diria
  // "tg 90°", então esse trecho conta como feixe em pé.
  const vertical = Math.abs(Math.cos(a)) < 1e-9 || Math.round(shown) === 90;
  const hits = !vertical && Math.cos(a) > 0; // o feixe vai na direção da parede
  const h = vertical ? null : Math.tan(a);
  const onWall = h !== null && h <= TOP && h >= -BOTTOM;

  // Marcas de 10 em 10 graus já percorridos (só as que o feixe atinge).
  const marks = [];
  for (let m = 10; m < 90 && m <= shown + 1e-9; m += 10) marks.push(m);

  // Fim do feixe: na parede, se a atinge dentro do desenho; se passa por cima
  // da parte desenhada, corta na borda de cima, ainda na direção certa; se
  // aponta para trás, vai até a borda do desenho.
  let beamEnd;
  if (hits && onWall) beamEnd = [WX, Y(h)];
  else if (hits) {
    const s = (LY - PAD) / Math.sin(a);
    beamEnd = [LX + Math.cos(a) * s, PAD];
  } else beamEnd = rayEnd(shown);
  const back = !hits && !vertical && shown > 90 && shown <= 180;
  const backOnWall = back && h >= -BOTTOM;
  const backEnd = back ? (backOnWall ? [WX, Y(h)] : rayEnd(shown, true)) : null;

  // Subida provocada por mais 1° de giro, para o painel.
  const whole = Math.round(shown);
  const next = whole + 1;
  const stepUp = whole < 89 ? Math.tan(rad(next)) - Math.tan(rad(whole)) : null;

  return (
    <div className={shared.wrapper} data-explorer="laser-wall">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Laser a 1 metro da parede, inclinado ${Math.round(shown)} graus.`}
        >
          {/* parede */}
          <rect x={WX} y={PAD - 6} width={12} height={H - 2 * PAD + 12} fill="var(--mv-guide)" fillOpacity={0.35} />
          <line x1={WX} y1={PAD - 6} x2={WX} y2={H - PAD + 6} stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />

          {/* régua da parede, de metro em metro */}
          {[-1, 0, 1, 2, 3].map((m) => (
            <g key={m}>
              <line x1={WX + 12} y1={Y(m)} x2={WX + 22} y2={Y(m)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
              <SvgMath x={WX + 26} y={Y(m)} math={`${m < 0 ? '-' : ''}${Math.abs(m)}\\text{ m}`} anchor="start" space={W - WX - 28} fontSize={12} />
            </g>
          ))}

          {/* linha da altura do laser */}
          <line x1={14} y1={LY} x2={WX} y2={LY} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />

          {/* cota de 1 m, embaixo: longe do feixe e quase sempre longe do
              prolongamento para trás */}
          <line x1={LX} y1={LY} x2={LX} y2={COTA_Y + 5} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="2 3" />
          <g stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25}>
            <line x1={LX} y1={COTA_Y} x2={WX} y2={COTA_Y} />
            <line x1={LX} y1={COTA_Y - 5} x2={LX} y2={COTA_Y + 5} />
          </g>
          <SvgMath x={(LX + WX) / 2} y={COTA_Y + 13} math="1\text{ m}" fontSize={12} halo />

          {/* marcas deixadas a cada 10° */}
          {marks.map((m) => {
            const hm = Math.tan(rad(m));
            if (hm > TOP) return null;
            return (
              <line key={m} x1={WX - 7} y1={Y(hm)} x2={WX + 7} y2={Y(hm)} stroke="var(--mv-tone-2)" strokeWidth={2} />
            );
          })}

          {/* prolongamento para trás, depois de 90° */}
          {back && (
            <line x1={LX} y1={LY} x2={backEnd[0]} y2={backEnd[1]} stroke="var(--mv-tone-1)" strokeWidth={1.5} strokeDasharray="4 5" />
          )}
          {backOnWall && (
            <circle cx={WX} cy={Y(h)} r={5} fill="var(--ifm-background-surface-color)" stroke="var(--mv-tone-1)" strokeWidth={2} />
          )}

          {/* feixe */}
          <line x1={LX} y1={LY} x2={beamEnd[0]} y2={beamEnd[1]} stroke="var(--mv-tone-2)" strokeWidth={2.5} strokeLinecap="round" />

          {/* arco do ângulo */}
          {shown > 2 && (
            <path
              d={`M ${LX + 30} ${LY} A 30 30 0 0 0 ${LX + 30 * Math.cos(a)} ${LY - 30 * Math.sin(a)}`}
              fill="none"
              stroke="var(--mv-tone-1)"
              strokeWidth={1.75}
            />
          )}
          {shown >= 14 && (
            <SvgMath
              x={LX + 46 * Math.cos(a / 2)}
              y={LY - 46 * Math.sin(a / 2)}
              math="\theta"
              tone={1}
              fontSize={14}
              halo
            />
          )}

          {/* o laser */}
          <rect x={LX - 30} y={LY - 7} width={30} height={14} rx={3} fill="var(--ifm-color-emphasis-700)" />
          <circle cx={LX} cy={LY} r={3.5} fill="var(--mv-tone-2)" />

          {/* ponto luminoso */}
          {hits && onWall && <circle cx={WX} cy={Y(h)} r={6} fill="var(--mv-tone-2)" />}
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {vertical ? (
          <p>
            Em <strong>90°</strong> o feixe aponta para cima, paralelo à parede. Ele nunca chega à parede: não há ponto
            luminoso, e não há altura para medir.
          </p>
        ) : hits ? (
          <>
            <p>
              Feixe inclinado <strong>{Math.round(shown)}°</strong>: o ponto está a{' '}
              <Formula math={`h = \\tg ${Math.round(shown)}^\\circ ${rel(Math.tan(rad(Math.round(shown))), 2)} ${mathNumber(Math.tan(rad(Math.round(shown))), 2)}\\text{ m}`} />
              {onWall ? '.' : ', acima da parte desenhada da parede.'}
            </p>
            {stepUp !== null && (
              <p>
                Girando mais 1°, até {next}°, o ponto sobe mais {fmt(stepUp, 2)} m.
              </p>
            )}
            {whole === 89 && <p>Girando mais 1°, o feixe fica paralelo à parede e o ponto desaparece.</p>}
          </>
        ) : (
          <p>
            Feixe inclinado <strong>{Math.round(shown)}°</strong>: ele aponta{' '}
            {Math.round(shown) >= 180 ? 'para trás, na horizontal' : 'para cima e para trás'}, afastando-se da parede, e não a atinge mais. Só o prolongamento do feixe para trás, tracejado, cruza a parede
            {!backOnWall ? ', abaixo da parte desenhada' : Math.abs(h) < 1e-9 ? ', na altura do laser' : `, ${fmt(-h, 2)} m abaixo do laser`}.
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Inclinação do feixe θ: {deg}°</span>
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            disabled={playing}
            aria-label="Inclinação do feixe em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setDeg(p)} disabled={playing}>
            {p}°
          </button>
        ))}
        <button type="button" onClick={() => play()}>
          Ver o giro de novo
        </button>
      </div>
    </div>
  );
}
