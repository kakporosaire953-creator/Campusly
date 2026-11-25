const { chromium } = require('playwright-core');
const ROUTES = ['/', '/a-propos', '/contribuer', '/conditions', '/politique-de-confidentialite', '/auth', '/offline', '/page-inexistante-xyz'];
(async () => {
  const b = await chromium.launch({ executablePath: '/tmp/chromium', args: ['--no-sandbox'] });
  const locales = ['fr', 'de', 'zh-CN', 'yo'];
  const report = [];
  for (const locale of locales) {
    for (const route of ROUTES) {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
      await ctx.addCookies([{ name: 'campusly.lang', value: locale, domain: 'localhost', path: '/' }]);
      const p = await ctx.newPage();
      const errors = [];
      p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });
      const res = await p.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' });
      await p.waitForTimeout(700);
      const info = await p.evaluate(() => ({
        lang: document.documentElement.lang,
        title: document.title,
        h1: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 60) || null,
        // Détection grossière de texte français resté en dur sur une page non française
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      report.push({ locale, route, status: res.status(), ...info, errors: errors.length ? errors : undefined });
      await ctx.close();
    }
  }
  console.log(JSON.stringify(report, null, 1));
  await b.close();
})();
