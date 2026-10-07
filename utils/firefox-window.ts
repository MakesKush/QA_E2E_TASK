import { Browser, BrowserContext, BrowserType, LaunchOptions } from '@playwright/test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { logger } from './logger';

export async function launchMaximizedFirefox(
  firefox: BrowserType,
  launchOptions: LaunchOptions,
): Promise<{ browser: Browser; close: () => Promise<void> }> {
  const profile = await mkdtemp(join(tmpdir(), 'negsim-firefox-'));
  let context: BrowserContext | undefined;

  try {
    await writeFile(
      join(profile, 'xulstore.json'),
      JSON.stringify({
        'chrome://browser/content/browser.xhtml': {
          'main-window': { sizemode: 'maximized' },
        },
      }),
    );

    logger.info('Launch Firefox with a maximized window');
    context = await firefox.launchPersistentContext(profile, {
      ...launchOptions,
      viewport: null,
    });

    const browser = context.browser();
    if (!browser) {
      throw new Error('Firefox did not return a browser instance');
    }

    return {
      browser,
      close: async () => {
        try {
          await context?.close();
        } finally {
          await rm(profile, { recursive: true, force: true });
        }
      },
    };
  } catch (error) {
    try {
      await context?.close();
    } finally {
      await rm(profile, { recursive: true, force: true });
    }
    throw error;
  }
}
