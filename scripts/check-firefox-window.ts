import assert from 'node:assert/strict';
import { firefox } from '@playwright/test';
import { launchMaximizedFirefox } from '../utils/firefox-window';

async function checkWindow(): Promise<void> {
  const maximized = await launchMaximizedFirefox(firefox, { headless: false });

  try {
    for (let index = 0; index < 2; index++) {
      const context = await maximized.browser.newContext({ viewport: null });
      try {
        const page = await context.newPage();
        await page.waitForFunction(() =>
          Math.abs(window.outerWidth - window.screen.availWidth) <= 32 &&
          Math.abs(window.outerHeight - window.screen.availHeight) <= 32,
        );
        const dimensions = await page.evaluate(() => ({
          availableWidth: window.screen.availWidth,
          availableHeight: window.screen.availHeight,
          outerWidth: window.outerWidth,
          outerHeight: window.outerHeight,
          innerHeight: window.innerHeight,
          fullscreen: Boolean(document.fullscreenElement),
          browserFullscreen: Boolean((window as Window & { fullScreen?: boolean }).fullScreen),
        }));

        assert.equal(dimensions.fullscreen, false);
        assert.equal(dimensions.browserFullscreen, false);
        assert(dimensions.innerHeight < dimensions.outerHeight);
        console.log(`Firefox context ${index + 1}: ${JSON.stringify(dimensions)}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await maximized.close();
  }
}

checkWindow().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
