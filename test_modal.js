const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

(async () => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  html = html.replace(/<link[^>]*font-awesome[^>]*>/i, '');
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  const window = dom.window;

  window.fetch = () => Promise.resolve({ ok: true, json: () => ({}) });

  const modalManagerCode = fs.readFileSync(path.join(__dirname, 'js/modal_manager.js'), 'utf8');
  window.eval(modalManagerCode);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

  if (!window.modalManager) {
    console.error('modalManager not set');
    process.exit(1);
  }

  window.modalManager.showManagementWindow('Test Modal', [{field:'id',title:'ID'}], [{id:1}]);
  const container = window.document.getElementById('modal-container');
  console.log('Modal display after call:', container.style.display);
})();
