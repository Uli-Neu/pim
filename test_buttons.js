const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

(async () => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  // Remove external font CSS to avoid network requests
  html = html.replace(/<link[^>]*font-awesome[^>]*>/i, '');
  const dom = new JSDOM(html, { runScripts: 'dangerously' });

  await new Promise(resolve => {
    dom.window.document.addEventListener('DOMContentLoaded', resolve);
  });

  dom.window.fetch = () => Promise.resolve({ ok: true, json: () => ({}) });

  const scripts = ['js/modal_manager.js', 'js/button_event_handler.js'];
  for (const scriptPath of scripts) {
    const code = fs.readFileSync(path.join(__dirname, scriptPath), 'utf8');
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = code;
    dom.window.document.body.appendChild(scriptEl);
  }

  const actions = ['btn-new','btn-save','btn-clear','btn-last','btn-update','btn-prev','btn-next','btn-search'];
  actions.forEach(id => {
    const btn = dom.window.document.getElementById(id);
    if (btn) btn.click();
  });

  console.log('Simulierte Klicks abgeschlossen');
})();
