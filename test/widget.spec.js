import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('widget loads correctly in browser', async ({ page }) => {
  const bundlePath = path.resolve(__dirname, '../dist/neutraltoken.min.js');
  const scriptContent = fs.readFileSync(bundlePath, 'utf8');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8" /></head>
    <body>
      <h1>Widget Test</h1>
      <script>${fs.readFileSync(path.resolve(__dirname, '../node_modules/buffer/index.js'), 'utf8')}</script>
      <script>
        window.process = { env: {} };
        window.global = window;
      </script>
      <script>${scriptContent}</script>
      <script>
        function waitForWidget(retries = 20) {
          if (typeof window.NeutralToken === 'object' &&
              typeof window.NeutralToken.requestBadge === 'function') {
            console.log("✅ Widget loaded and requestBadge is available.");
            return;
          }
          if (retries <= 0) {
            console.error("❌ Widget did not load in time.");
            return;
          }
          setTimeout(() => waitForWidget(retries - 1), 100);
        }
        waitForWidget();
      </script>
    </body>
    </html>
  `;

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(msg.text());
    console.log('[Browser Console]', msg.text());
  });
  page.on('pageerror', err => {
    console.log('[Page Error]', err.message);
  });

  await page.setContent(html);
  await page.waitForTimeout(2000);

  const result = consoleLogs.find(log => log.includes('✅ Widget loaded'));
  expect(result).toBeDefined();
});

