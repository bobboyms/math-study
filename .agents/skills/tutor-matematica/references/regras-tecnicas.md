# Regras técnicas do curso

Aplicar ao alterar conteúdo ou componentes do site.

## Conteúdo e estrutura

- Escrever texto visível em português com acentuação completa. Manter arquivos e ids em ASCII minúsculo com hífens.
- Usar `.md` para páginas de texto e `.mdx` apenas quando importar React.
- Toda página precisa ao menos de `title` no frontmatter e do mesmo título como `#` no corpo.
- O Docusaurus remove o prefixo numérico do id: `04-fracoes.md` usa `matematica-basica/fracoes` em `sidebars.js`, nunca o prefixo.
- Adicionar páginas novas a `sidebars.js` e usar links relativos sem prefixo e sem `/docs/`, por exemplo `[Frações](./fracoes)`.
- Para inserir uma página no meio, renomear os arquivos posteriores com `git mv`, ajustar os rótulos da barra lateral e atualizar o índice do capítulo.
- Não renomear títulos sem necessidade: cada `##` é uma âncora e links quebrados falham no build.

## Fórmulas

- Usar KaTeX: inline `$f(x) = x^2$` e bloco `$$...$$`.
- Escrever valores em reais como `R\$ 100`.
- Em `.mdx`, escapar `{` e `<` no texto comum como `\{` e `\<`.
- Usar `\times`, `\div`, `\operatorname{mmc}`, `\operatorname{mdc}`, `\ldots`, `\text{...}` e `\lvert x \rvert` conforme a notação do curso.
- Para trigonometria, usar as macros em português definidas em `src/katexMacros.js`; editar somente esse arquivo para acrescentar uma macro, pois ele alimenta corpo e desenhos.

## Validar

- Conferir cada conta, fatoração, MMC, MDC, simplificação, potência, raiz, porcentagem e item de gabarito com `python3 -c`.
- Executar `npm run build` antes de concluir. Ele valida MDX, links e barra lateral.
- Conferir fórmulas na renderização de `npm run start` quando a alteração envolver LaTeX ou visual.
