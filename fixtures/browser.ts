import { test as base } from '@playwright/test';
import { launchMaximizedFirefox } from '../utils/firefox-window';

export const test = base.extend({
  browser: [async ({ playwright, browserName, launchOptions, headless, channel, connectOptions }, use) => {
    if (browserName === 'firefox' && !headless && !connectOptions) {
      const firefox = await launchMaximizedFirefox(playwright.firefox, {
        ...launchOptions,
        headless,
        channel,
      });

      try {
        await use(firefox.browser);
      } finally {
        await firefox.close();
      }
      return;
    }

    const browser = connectOptions
      ? await playwright[browserName].connect(connectOptions)
      : await playwright[browserName].launch({ ...launchOptions, headless, channel });

    try {
      await use(browser);
    } finally {
      await browser.close();
    }
  }, { scope: 'worker', timeout: 0 }],
});

export { expect } from '@playwright/test';
