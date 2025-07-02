import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundlePath = path.resolve(__dirname, '../dist/neutraltoken.min.js');
const scriptContent = fs.readFileSync(bundlePath, 'utf8');

test.skip('widget bundle exposes global API', () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    runScripts: 'outside-only'
  });
  dom.window.process = { env: {} };
  dom.window.eval(scriptContent);
  expect(typeof dom.window.NeutralToken).toBe('object');
  expect(typeof dom.window.NeutralToken.requestBadge).toBe('function');
});
