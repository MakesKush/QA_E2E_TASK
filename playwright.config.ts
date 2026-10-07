import { defineConfig } from '@playwright/test';
import { config } from './configs/config';

export default defineConfig({
  timeout: config.globalTimeout,
  testDir: './tests',
  outputDir: 'test-results',
  retries: 0,
  reporter: [['list'], ['allure-playwright']],

  use: {
    headless: config.headless,
    baseURL: config.baseURL,
    viewport: null,  
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

   
  projects: [
    {
      name: 'msedge',
      use: {
         
        browserName: 'chromium',
        channel: 'msedge',
        launchOptions: {
          args: [
            '--start-maximized',
             
             
          ],
        },
      },
    },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: [
            '--start-maximized',
             
             
          ],
          ignoreDefaultArgs: ['--disable-extensions'],  
        },
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: null,
        launchOptions: {
           
        },
      },
    },
  ],

  workers: 4,
});
