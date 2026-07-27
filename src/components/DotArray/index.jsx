import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Pontos em linhas e colunas: a leitura discreta da multiplicação, onde a
// quantidade é contável. É a figura irmã do AreaModel — lá a quantidade é área
// contínua, aqui são objetos que dá para contar um a um.
//
// Dois arranjos:
//   grade   — rows x cols, com rótulo opcional por linha
//   grupos  — `groups` blocos separados de `perGroup` pontos cada
//
// `gnomon={n}` pinta com o segundo tom tudo que está fora do quadrado n x n,
// isto é, o "L" que se acrescenta ao passar de n^2 para (n+1)^2.

const DOT_R = 5;
const GAP = 22;
const PAD = 14;
const LABEL_W = 92;
const LABEL_GAP = 16;
const GROUP_GAP = 26;
const GROUP_LABEL_DROP = 26;

function Dots({rows, cols, x0, y0, tone, gnomon}) {
  const out = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const dentro = gnomon != null && r < gnomon && c < gnomon;
      const usado = gnomon != null && !dentro ? 2 : tone;
      out.push(
        <circle
          key={`${r}-${c}`}
          className={styles.dot}
          style={{'--tone': `var(--mv-tone-${usado})`}}
          cx={x0 + c * GAP + DOT_R}
          cy={y0 + r * GAP + DOT_R}
          r={DOT_R}
        />,
      );
    }
  }
  return <g>{out}</g>;
}

export default function DotArray({
  rows,
  cols,
  tone = 1,
  gnomon,
  rowLabels,
  groups,
  perGroup,
  groupLabels,
  caption,
}) {
  const modoGrupos = groups != null && perGroup != null;

  if (modoGrupos) {
    const larguraGrupo = perGroup * GAP;
    const viewW = PAD * 2 + groups * larguraGrupo + (groups - 1) * GROUP_GAP;
    const viewH =
      PAD * 2 + GAP + (groupLabels ? GROUP_LABEL_DROP : 0);

    return (
      <figure className={styles.figure}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${viewW} ${viewH}`}
          style={{maxWidth: `${Math.max(viewW, 300)}px`}}
          role="img"
          aria-label={caption || `${groups} grupos de ${perGroup} pontos.`}
        >
          {Array.from({length: groups}, (unused, g) => {
            const x0 = PAD + g * (larguraGrupo + GROUP_GAP);
            return (
              <g key={g}>
                <Dots rows={1} cols={perGroup} x0={x0} y0={PAD} tone={tone} />
                {groupLabels && groupLabels[g] && (
                  <SvgMath
                    x={x0 + larguraGrupo / 2}
                    y={PAD + GAP + GROUP_LABEL_DROP - 12}
                    math={groupLabels[g]}
                    fontSize={13}
                    space={larguraGrupo + GROUP_GAP}
                  />
                )}
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    );
  }

  const temRotulos = Boolean(rowLabels);
  const x0 = PAD;
  const viewW = PAD * 2 + cols * GAP + (temRotulos ? LABEL_GAP + LABEL_W : 0);
  const viewH = PAD * 2 + rows * GAP;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 260)}px`}}
        role="img"
        aria-label={caption || `Arranjo de ${rows} linhas por ${cols} colunas.`}
      >
        <Dots rows={rows} cols={cols} x0={x0} y0={PAD} tone={tone} gnomon={gnomon} />
        {temRotulos &&
          rowLabels.map((rotulo, r) =>
            rotulo ? (
              <SvgMath
                key={r}
                x={x0 + cols * GAP + LABEL_GAP}
                y={PAD + r * GAP + DOT_R}
                math={rotulo}
                anchor="start"
                space={LABEL_W}
                fontSize={13}
              />
            ) : null,
          )}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
