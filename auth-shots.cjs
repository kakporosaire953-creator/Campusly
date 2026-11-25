const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/tmp/chromium', args: ['--no-sandbox'] });
  for (const [lang, w] of [['fr',1440],['de',1440],['zh-CN',390],['yo',390]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    await ctx.addCookies([{ name: 'campusly.lang', value: lang, domain: 'localhost', path: '/' }]);
    const p = await ctx.newPage();
    await p.goto('http://localhost:3000/auth?tab=register', { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    await p.screenshot({ path: `/tmp/shots/p-auth-${lang}-${w}.png` });
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(lang, w, 'overflowX', ov);
    await ctx.close();
  }
  await b.close();
})();
