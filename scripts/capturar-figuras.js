// Captura cada figura de uma ou mais páginas do site, uma imagem por figura,
// para conferir com os olhos rótulos, alinhamento e coerência com o texto.
//
// Pré-requisitos (não entram no package.json):
//   npm i --no-save playwright        # usa o Google Chrome já instalado
//   npm run ver                       # build + site pronto na porta 3300
//
// Uso:
//   node scripts/capturar-figuras.js <pasta-de-saida> geometria/angulos [funcoes/funcao-afim ...]
//
// Variáveis opcionais:
//   BASE=http://localhost:3300/math-study   (padrão, a porta do npm run ver)
//   THEME=dark                              tema escuro
//   WIDTH=390                               largura de celular (padrão 900)
//   MOTION=play                             deixa as animações rodarem e captura
//                                           cada figura WAIT ms depois de ela
//                                           entrar na tela (padrão 1200). Sem
//                                           MOTION, o navegador pede "menos
//                                           movimento" e toda animação aparece
//                                           direto no quadro final.
//
// Componente interativo (marcado com `data-explorer`) é capturado inteiro, com
// o painel de números e os controles, porque o texto do painel também precisa
// bater com o desenho.
//
// Para conferir uma animação, capture três vezes: sem MOTION (quadro final) e
// com MOTION=play em dois tempos, por exemplo WAIT=600 e WAIT=2000.
//
// Saída: <pasta>/<capitulo>-<pagina>-NN.png e <pasta>/index.txt com a legenda de
// cada figura. Abra cada PNG e compare com o texto ao redor.

const { chromium } = require('playwright');
const fs = require('fs');

const [out, ...pages] = process.argv.slice(2);
if (!out || pages.length === 0) {
  console.error('uso: node scripts/capturar-figuras.js <pasta> <capitulo/pagina> [...]');
  process.exit(1);
}
const BASE = process.env.BASE || 'http://localhost:3300/math-study';
const PLAY = process.env.MOTION === 'play';
const WAIT = Number(process.env.WAIT || 1200);

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: Number(process.env.WIDTH || 900), height: 1200 },
    deviceScaleFactor: 1.5,
    reducedMotion: PLAY ? 'no-preference' : 'reduce',
  });
  const page = await context.newPage();
  if (process.env.THEME === 'dark') {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  }
  const index = [];
  for (const path of pages) {
    // A barra final evita o redirecionamento 302 do servidor.
    await page.goto(`${BASE}/${path}/`, { waitUntil: 'networkidle' });
    // Abre dicas e gabaritos recolhidos: figura dentro de <details> também conta.
    for (const summary of await page.$$('article details:not([open]) > summary')) {
      await summary.click().catch(() => {});
    }
    // Espera o CSS do KaTeX: sem ele, todo rótulo sai duplicado na captura.
    await page.waitForTimeout(800);
    const figs = await page.$$(
      'article [data-explorer], article figure:not([data-explorer] figure), article svg:not(figure svg):not(.katex svg):not([data-explorer] svg)',
    );
    let n = 0;
    for (const fig of figs) {
      const box = await fig.boundingBox();
      if (!box || box.width < 120 || box.height < 80) continue;
      n++;
      const name = `${path.replace(/\//g, '-')}-${String(n).padStart(2, '0')}.png`;
      await fig.scrollIntoViewIfNeeded();
      if (PLAY) await page.waitForTimeout(WAIT);
      await fig.screenshot({ path: `${out}/${name}` });
      const caption = await fig.evaluate((e) => e.querySelector('figcaption')?.innerText || '');
      index.push(`${name}\t${caption}`);
    }
    if (n === 0) index.push(`${path}\t(nenhuma figura encontrada — confira a URL)`);
  }
  fs.writeFileSync(`${out}/index.txt`, index.join('\n') + '\n');
  await browser.close();
  console.log(`${index.length} figuras em ${out}`);
})();
