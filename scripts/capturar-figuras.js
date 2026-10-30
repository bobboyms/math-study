// Captura cada figura de uma ou mais páginas do site, uma imagem por figura,
// para conferir com os olhos rótulos, alinhamento e coerência com o texto.
//
// Pré-requisitos (não entram no package.json):
//   npm i --no-save playwright        # usa o Google Chrome já instalado
//   npm run start -- --port 3300      # ou: npm run build && npm run serve -- --port 3210
//
// Uso:
//   node scripts/capturar-figuras.js <pasta-de-saida> geometria/angulos [funcoes/funcao-afim ...]
//
// Variáveis opcionais:
//   BASE=http://localhost:3300/math-study   (padrão; troque a porta se usar o serve)
//   THEME=dark                              tema escuro
//   WIDTH=390                               largura de celular (padrão 900)
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

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: Number(process.env.WIDTH || 900), height: 1200 },
    deviceScaleFactor: 1.5,
  });
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
    const figs = await page.$$('article figure, article svg:not(figure svg):not(.katex svg)');
    let n = 0;
    for (const fig of figs) {
      const box = await fig.boundingBox();
      if (!box || box.width < 120 || box.height < 80) continue;
      n++;
      const name = `${path.replace(/\//g, '-')}-${String(n).padStart(2, '0')}.png`;
      await fig.scrollIntoViewIfNeeded();
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
