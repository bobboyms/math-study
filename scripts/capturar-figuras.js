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
  const SELECTOR =
    'article [data-explorer], article figure:not([data-explorer] figure), article svg:not(figure svg):not(.katex svg):not([data-explorer] svg)';
  // Abre a página e espera o CSS do KaTeX: sem ele, todo rótulo sai duplicado.
  // A barra final evita o redirecionamento 302 do servidor.
  const load = async (p, path) => {
    await p.goto(`${BASE}/${path}/`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
  };
  for (const path of pages) {
    await load(page, path);
    // Abre dicas e gabaritos recolhidos: figura dentro de <details> também conta.
    for (const summary of await page.$$('article details:not([open]) > summary')) {
      await summary.click().catch(() => {});
    }
    await page.waitForTimeout(800);
    const figs = await page.$$(SELECTOR);
    let n = 0;
    for (let i = 0; i < figs.length; i++) {
      const fig = figs[i];
      const box = await fig.boundingBox();
      if (!box || box.width < 120 || box.height < 80) continue;
      n++;
      const name = `${path.replace(/\//g, '-')}-${String(n).padStart(2, '0')}.png`;
      const caption = await fig.evaluate((e) => e.querySelector('figcaption')?.innerText || '');
      index.push(`${name}\t${caption}`);
      if (!PLAY) {
        await fig.scrollIntoViewIfNeeded();
        await fig.screenshot({ path: `${out}/${name}` });
        continue;
      }
      // Quadro do meio. A animação começa quando a figura entra na tela, uma
      // vez só, e abrir os <details> acima já rolou a página por todas as
      // figuras: aqui elas já terminaram. Por isso cada figura ganha uma
      // página nova, em que só os <details> que a contêm são abertos, e o
      // WAIT conta a partir de quando ela aparece. A figura que já está na
      // tela ao carregar (a do topo) começa antes, e sai um pouco adiantada.
      const fresh = await context.newPage();
      await load(fresh, path);
      const target = (await fresh.$$(SELECTOR))[i];
      if (target) {
        const closed = await target.evaluate((e) => {
          const all = Array.from(document.querySelectorAll('article details'));
          const list = [];
          for (let d = e.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) {
            if (!d.open) list.unshift(all.indexOf(d));
          }
          return list;
        });
        for (const k of closed) {
          await fresh.locator('article details').nth(k).locator(':scope > summary').click().catch(() => {});
        }
        await target.scrollIntoViewIfNeeded();
        await fresh.waitForTimeout(WAIT);
        await target.screenshot({ path: `${out}/${name}` });
      }
      await fresh.close();
    }
    if (n === 0) index.push(`${path}\t(nenhuma figura encontrada: confira a URL)`);
  }
  fs.writeFileSync(`${out}/index.txt`, index.join('\n') + '\n');
  await browser.close();
  console.log(`${index.length} figuras em ${out}`);
})();
