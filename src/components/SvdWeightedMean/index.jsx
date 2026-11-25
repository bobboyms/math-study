import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, frame, num, numText} from '../LinearGridMorph/plane';

// O esticamento ao quadrado é uma média dos autovalores (lição 11.13).
//
// À esquerda, o círculo de raio 1, as retas de v1 (tom 1) e v2 (tom 2),
// perpendiculares, e a seta v. A seta v é decomposta em a·v1 + b·v2: os dois
// pedaços aparecem como setas tracejadas, formando um retângulo. À direita,
// uma régua de 0 até um pouco além de λ1: a barra dos pesos (a² no tom 1, b²
// no tom 2, juntos medem 1) e o ponto λ1a² + λ2b², que anda entre λ2 e λ1 e
// nunca sai desse trecho. O deslizante gira v de grau em grau.

export default function SvdWeightedMean({l1 = 45, l2 = 5, v1Angle = 45, name = 'A', initial = 20, caption}) {
  const uid = useId().replace(/:/g, '-');
  const [deg, setDeg] = useState(initial);
  const r1 = (v1Angle * Math.PI) / 180;
  const v1 = [Math.cos(r1), Math.sin(r1)];
  const v2 = [-v1[1], v1[0]];
  const r = (deg * Math.PI) / 180;
  const v = [Math.cos(r), Math.sin(r)];
  const a = v[0] * v1[0] + v[1] * v1[1];
  const b = v[0] * v2[0] + v[1] * v2[1];
  const mean = l1 * a * a + l2 * b * b;

  const f = frame([-1.5, 1.5, -1.5, 1.5], 70);
  const clipId = `clip${uid}`;
  const R = 5;
  const pa = [a * v1[0], a * v1[1]];
  const pb = [b * v2[0], b * v2[1]];
  const circle = [];
  for (let i = 0; i <= 96; i += 1) {
    const t = (i / 96) * 2 * Math.PI;
    circle.push(f.P([Math.cos(t), Math.sin(t)]));
  }

  // Régua da média.
  const GW = 300;
  const GH = 232;
  const x0 = 30;
  const x1 = GW - 30;
  const top = l1 * 1.1;
  const GX = (y) => x0 + ((x1 - x0) * y) / top;
  const yBar = 70;
  const yRule = 170;
  const textColor = 'var(--ifm-color-emphasis-800)';
  const wA = (x1 - x0) * 0.6;
  const bx0 = x0;

  return (
    <div className={shared.wrapper} data-explorer="svd-weighted-mean">
      <figure className={styles.figure}>
        <div className={styles.row}>
          <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="A seta v escrita como a v1 mais b v2">
            <ClipDefs f={f} id={clipId} />
            <FixedGrid f={f} clipId={clipId} />
            <Axes f={f} />
            <path d={`M ${circle.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} Z`} fill="none" stroke="var(--mv-guide)" strokeWidth={1.4} />
            {[
              [v1, 1],
              [v2, 2],
            ].map(([d, tone]) => (
              <line
                key={tone}
                x1={f.X(-R * d[0])}
                y1={f.Y(-R * d[1])}
                x2={f.X(R * d[0])}
                y2={f.Y(R * d[1])}
                stroke={`var(--mv-tone-${tone})`}
                strokeWidth={1.2}
                strokeDasharray="6 5"
                opacity={0.6}
                clipPath={`url(#${clipId})`}
              />
            ))}
            <Arrow f={f} to={pa} tone={1} width={2.2} dashed label={Math.abs(a) > 0.25 && Math.abs(b) > 0.25 ? `a\\vec{v}_1` : null} offset={[-14 * v1[1] * Math.sign(b || 1), 14 * v1[0] * Math.sign(b || 1) + 4, 'middle']} />
            <Arrow f={f} to={pb} tone={2} width={2.2} dashed label={Math.abs(a) > 0.25 && Math.abs(b) > 0.25 ? `b\\vec{v}_2` : null} offset={[14 * v1[0] * Math.sign(a || 1), 14 * v1[1] * Math.sign(a || 1) + 4, 'middle']} />
            <line x1={f.X(pa[0])} y1={f.Y(pa[1])} x2={f.X(v[0])} y2={f.Y(v[1])} stroke="var(--mv-guide)" strokeWidth={1.2} />
            <line x1={f.X(pb[0])} y1={f.Y(pb[1])} x2={f.X(v[0])} y2={f.Y(v[1])} stroke="var(--mv-guide)" strokeWidth={1.2} />
            <Arrow f={f} to={v} tone={3} label={'\\vec{v}'} offset={[16 * v[0], -16 * v[1] + 4, 'middle']} />
          </svg>
          <svg className={styles.svg} viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label="Os pesos e a média dos dois autovalores">
            <text x={x0} y={yBar - 30} fontSize={12} fill={textColor}>
              pesos: a² + b² = 1
            </text>
            <rect x={bx0} y={yBar - 18} width={wA * a * a} height={22} fill="var(--mv-tone-1)" opacity={0.85} />
            <rect x={bx0 + wA * a * a} y={yBar - 18} width={wA * b * b} height={22} fill="var(--mv-tone-2)" opacity={0.85} />
            <rect x={bx0} y={yBar - 18} width={wA} height={22} fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1} />
            <text x={bx0} y={yBar + 22} fontSize={12} fill="var(--mv-tone-1)">
              a² = {numText(a * a, 2)}
            </text>
            <text x={bx0 + wA} y={yBar + 22} fontSize={12} textAnchor="end" fill="var(--mv-tone-2)">
              b² = {numText(b * b, 2)}
            </text>

            <rect x={GX(l2)} y={yRule - 8} width={GX(l1) - GX(l2)} height={16} fill="var(--mv-tone-3)" opacity={0.18} />
            <line x1={x0} y1={yRule} x2={x1} y2={yRule} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
            {[0, l2, l1].map((y) => (
              <g key={y}>
                <line x1={GX(y)} y1={yRule - 6} x2={GX(y)} y2={yRule + 6} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
                <text x={GX(y)} y={yRule + 22} fontSize={12} textAnchor="middle" fill={textColor}>
                  {y === 0 ? '0' : y === l2 ? `λ₂ = ${numText(l2, 2)}` : `λ₁ = ${numText(l1, 2)}`}
                </text>
              </g>
            ))}
            <circle cx={GX(mean)} cy={yRule} r={7} fill="var(--mv-tone-3)" />
            <text x={Math.min(Math.max(GX(mean), x0 + 30), x1 - 30)} y={yRule - 16} fontSize={12.5} fontWeight={600} textAnchor="middle" fill="var(--mv-tone-3)">
              {numText(mean, 2)}
            </text>
            <text x={(x0 + x1) / 2} y={yRule + 46} fontSize={11.5} textAnchor="middle" fill={textColor}>
              ‖{name}v‖² = λ₁a² + λ₂b², sempre na faixa verde
            </text>
          </svg>
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Ângulo da seta v: <strong>{deg}°</strong>
          </span>
          <input type="range" min={0} max={179} step={1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} aria-label="Ângulo da seta v, em graus" />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`a = ${num(a, 2)},\\ b = ${num(b, 2)}; \\qquad \\lVert ${name}\\vec{v} \\rVert^2 = ${num(l1, 2)} \\times ${num(a * a, 2)} + ${num(l2, 2)} \\times ${num(b * b, 2)} = ${num(mean, 2)}`}
          />
        </p>
        <p className={shared.hint}>
          {Math.abs(b) < 1e-9
            ? `v está na reta de v₁: todo o peso vai para λ₁, e a média é o máximo, ${numText(l1, 2)}.`
            : Math.abs(a) < 1e-9
              ? `v está na reta de v₂: todo o peso vai para λ₂, e a média é o mínimo, ${numText(l2, 2)}.`
              : 'Com os dois pesos diferentes de zero, a média fica estritamente entre λ₂ e λ₁.'}
        </p>
      </div>
    </div>
  );
}
