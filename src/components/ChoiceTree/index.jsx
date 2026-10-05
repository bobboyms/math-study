import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Cada folha representa uma sequência completa. Os ramos e a quantidade de
// folhas são calculados das opções, para o desenho acompanhar a contagem.
export default function ChoiceTree({stages, repeat = true, caption}) {
  const nodes = [];
  const edges = [];
  const leaves = [];
  let nextY = 30;
  const columnGap = 130;

  function branch(path, depth, label) {
    const node = {x: 48 + depth * columnGap, label, depth};
    nodes.push(node);
    if (depth === stages.length) {
      node.y = nextY;
      nextY += 48;
      leaves.push({...node, path});
      return node;
    }
    const children = stages[depth]
      .filter((option) => repeat || !path.includes(option))
      .map((option) => branch([...path, option], depth + 1, option));
    if (children.length === 0) {
      node.y = nextY;
      nextY += 48;
    } else {
      node.y = (children[0].y + children[children.length - 1].y) / 2;
      children.forEach((child) => edges.push({parent: node, child}));
    }
    return node;
  }

  branch([], 0, '\\text{início}');
  const width = 48 + stages.length * columnGap + 120;
  const height = nextY - 18;
  const description = `${caption || 'Árvore de possibilidades.'} ${leaves.length} resultados: ${leaves.map((leaf) => leaf.path.join('')).join(', ')}.`;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${width} ${height}`}
        style={{maxWidth: `${width}px`}}
        role="img"
        aria-label={description}
      >
        {edges.map(({parent, child}, i) => (
          <line key={`edge-${i}`} className={styles.branch}
            x1={parent.x + 25} y1={parent.y}
            x2={child.x - 25} y2={child.y} />
        ))}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <rect className={node.depth === stages.length ? styles.leaf : styles.node}
              x={node.x - 25} y={node.y - 17} width={50} height={34} rx={8} />
            <SvgMath x={node.x} y={node.y} math={node.label}
              space={48} fontSize={14} />
          </g>
        ))}
        {leaves.map((leaf, i) => (
          <SvgMath key={`result-${i}`} x={leaf.x + 68} y={leaf.y}
            math={leaf.path.join('')} space={76} fontSize={15} tone={2} />
        ))}
      </svg>
      <figcaption className={styles.caption}>
        {caption && `${caption} `}Total: {leaves.length} resultados.
      </figcaption>
    </figure>
  );
}
