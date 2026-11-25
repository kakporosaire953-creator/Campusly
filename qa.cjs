const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/tmp/chromium', args: ['--no-sandbox'] });
  const results = { overflow: [], flash: [], reduced: [], persist: [] };
  const viewports = [[1440,900],[1024,768],[768,1024],[390,844],[360,800]];
  const routes = ['/','/a-propos','/conditions','/auth','/dashboard','/offline'];
  for (const [w,h] of viewports) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    await ctx.addCookies([{ name: 'campusly.lang', value: 'de', domain: 'localhost', path: '/' }]);
    const p = await ctx.newPage();
    for (const r of routes) {
      await p.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' });
      await p.waitForTimeout(600);
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 2) results.overflow.push({ r, w, ov });
    }
    await ctx.close();
  }
  // Flash de thème : on charge en sombre mémorisé et on relève data-theme avant hydratation
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await p.evaluate(() => localStorage.setItem('campusly.theme', 'dark'));
    await p.reload({ waitUntil: 'domcontentloaded' });
    const early = await p.evaluate(() => document.documentElement.dataset.theme);
    await p.waitForTimeout(800);
    const later = await p.evaluate(() => document.documentElement.dataset.theme);
    results.flash.push({ early, later, ok: early === 'dark' && later === 'dark' });
    await ctx.close();
  }
  // prefers-reduced-motion : contenu visible
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    const hidden = await p.evaluate(() => {
      const els = [...document.querySelectorAll('[data-rise],[data-fade],[data-words],h1,h2,.ed-ledger li')];
      return els.filter((e) => {
        const cs = getComputedStyle(e);
        return cs.opacity === '0' || cs.visibility === 'hidden';
      }).length;
    });
    results.reduced.push({ hiddenElements: hidden });
    await ctx.close();
  }
  // Persistance : langue + thème gardés après navigation
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto('http://localhost:3000/a-propos', { waitUntil: 'networkidle' });
    await p.locator('.prefs__trigger').first().click();
    await p.waitForTimeout(300);
    await p.locator('.prefs__options--theme [role=radio]').nth(1).click();
    await p.waitForTimeout(600);
    await p.goto('http://localhost:3000/conditions', { waitUntil: 'networkidle' });
    // La langue : on la change par le panneau, puis on navigue ailleurs.
    await p.locator('.prefs__trigger').first().click();
    await p.waitForTimeout(300);
    await p.locator(".prefs__options:not(.prefs__options--theme) [role=radio]").nth(2).click(); // Español
    await p.waitForTimeout(1500);
    const afterSwitch = { url: p.url(), lang: await p.evaluate(() => document.documentElement.lang) };
    await p.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    results.persist.push({
      theme: await p.evaluate(() => document.documentElement.dataset.theme),
      lang: await p.evaluate(() => document.documentElement.lang),
      afterSwitch,
    });
    await ctx.close();
  }
  console.log(JSON.stringify(results, null, 1));
  await b.close();
})();
