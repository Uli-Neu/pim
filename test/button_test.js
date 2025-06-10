const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { JSDOM, ResourceLoader } = require('jsdom');

// Prevent network requests for external resources
class LocalResourceLoader extends ResourceLoader {
  fetch(url, options) {
    if (url.startsWith('http')) {
      return Promise.resolve(Buffer.from(''));
    }
    if (url.endsWith('tab_content.js')) {
      return Promise.resolve(Buffer.from(''));
    }
    return super.fetch(url, options);
  }
}

async function createDom() {
  const base = 'file://' + path.join(__dirname, '..') + '/';
  return JSDOM.fromFile(path.join(__dirname, '..', 'index.html'), {
    runScripts: 'dangerously',
    resources: new LocalResourceLoader(),
    pretendToBeVisual: true,
    url: base,
    beforeParse(window) {
      class MockXHR {
        open() {}
        setRequestHeader() {}
        send() {
          this.status = 200;
          this.responseText = JSON.stringify({ success: true, data: [] });
          if (this.onload) this.onload();
        }
      }
      window.XMLHttpRequest = MockXHR;
    }
  });
}

async function loadDom() {
  const dom = await createDom();
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  return dom;
}

async function testAddItemModal(dom) {
  const { document } = dom.window;
  const addBtn = document.getElementById('btn-add-package-item');
  addBtn.click();
  assert.strictEqual(document.getElementById('add-item-modal').style.display, 'flex', 'Add item modal should open');
  document.getElementById('item-name').value = 'Test Item';
  document.getElementById('item-quantity').value = '2';
  document.getElementById('btn-confirm-add').click();
  assert.strictEqual(document.getElementById('add-item-modal').style.display, 'none', 'Add item modal should close');
  const rows = document.querySelectorAll('#package-table tbody tr');
  assert.strictEqual(rows.length, 1, 'Item row should be added');
  const row = rows[0];
  assert.strictEqual(row.children[0].textContent, 'Test Item');
  assert.strictEqual(row.children[1].textContent, '2');
}

async function testManageCategory(dom) {
  const { document } = dom.window;
  const manageCatBtn = document.getElementById('btn-manage-category');
  manageCatBtn.click();
  assert.strictEqual(document.getElementById('modal-container').style.display, 'block', 'Management modal should open');
  dom.window.modalManager.hideModal();
  assert.strictEqual(document.getElementById('modal-container').style.display, 'none', 'Management modal should close');
}

async function testManageStatus(dom) {
  const { document } = dom.window;
  const manageStatusBtn = document.getElementById('btn-manage-status');
  manageStatusBtn.click();
  assert.strictEqual(document.getElementById('modal-container').style.display, 'block', 'Status management should open');
  dom.window.modalManager.hideModal();
  assert.strictEqual(document.getElementById('modal-container').style.display, 'none', 'Status management should close');
}

async function testManageLanguages(dom) {
  const { document } = dom.window;
  document.querySelector("button[data-tab='languages']").click();
  const manageLangBtn = document.getElementById('btn-manage-languages');
  manageLangBtn.click();
  assert.strictEqual(document.getElementById('modal-container').style.display, 'block', 'Languages management should open');
  dom.window.modalManager.hideModal();
  assert.strictEqual(document.getElementById('modal-container').style.display, 'none', 'Languages management should close');
}

async function run() {
  const dom = await loadDom();
  await testAddItemModal(dom);
  await testManageCategory(dom);
  await testManageStatus(dom);
  await testManageLanguages(dom);
  console.log('All tests passed');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
