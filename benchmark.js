const { performance } = require('perf_hooks');

const jsdomCode = `
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><div id="prog"></div><div id="nav"></div><div id="fab-w"></div>');
  const document = dom.window.document;

  function runBaseline() {
      const start = performance.now();
      for (let i = 0; i < 100000; i++) {
          const sy = i % 1000;
          const sh = 2000;
          document.getElementById('prog').style.width = (sy/sh*100) + '%';
          document.getElementById('nav').classList.toggle('sc', sy > 50);
          document.getElementById('fab-w').classList.toggle('vis', sy > 400);
      }
      return performance.now() - start;
  }

  function runOptimized() {
      const progEl = document.getElementById('prog');
      const navEl = document.getElementById('nav');
      const fabWEl = document.getElementById('fab-w');
      const start = performance.now();
      for (let i = 0; i < 100000; i++) {
          const sy = i % 1000;
          const sh = 2000;
          progEl.style.width = (sy/sh*100) + '%';
          navEl.classList.toggle('sc', sy > 50);
          fabWEl.classList.toggle('vis', sy > 400);
      }
      return performance.now() - start;
  }

  const baseTime = runBaseline();
  const optTime = runOptimized();
  console.log('Baseline:', baseTime.toFixed(2), 'ms');
  console.log('Optimized:', optTime.toFixed(2), 'ms');
  console.log('Improvement:', ((baseTime - optTime) / baseTime * 100).toFixed(2) + '%');
`;

try {
  require('jsdom');
  eval(jsdomCode);
} catch (e) {
  console.log('jsdom not installed. Run: npm install jsdom');
}
