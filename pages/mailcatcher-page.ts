import { Locator, Page, Response } from '@playwright/test';
import { BasePage } from './base-page';
import { config } from '../configs/config';
import { logger } from '../utils/logger';

export class MailcatcherPage extends BasePage {
  readonly inbox = this.page.getByRole('table');
  readonly recipient = this.page.locator('#message dd.to');
  readonly subject = this.page.locator('#message dd.subject');
  readonly activationLink = this.page.frameLocator('iframe.body').getByRole('link', {
    name: 'complete registration',
    exact: true,
  });

  async open(): Promise<Response | null> {
    logger.info('Open MailCatcher');
    return this.page.goto('/mailcatcher');
  }

  registrationMessage(email: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: `<${email}>`, exact: true }),
      hasText: 'action required for your negotiation sim game registration',
    });
  }

  async openRegistrationMessage(email: string): Promise<void> {
    logger.info(`Wait for registration email: ${email}`);
    const message = this.registrationMessage(email);
    await message.waitFor({ state: 'visible', timeout: config.mailTimeout });
    logger.info('Open registration email');
    await message.click();
  }

  async completeRegistration(): Promise<Page> {
    const href = await this.activationLink.getAttribute('href');
    if (!href) {
      throw new Error('Registration email has no activation link');
    }

    const activationURL = new URL(href, config.baseURL);
    if (activationURL.origin !== config.baseURL || activationURL.pathname !== '/user/activate') {
      throw new Error('Registration email must link to the qa6 activation page');
    }

    logger.info('Follow complete registration link');
    const popup = this.page.waitForEvent('popup');
    await this.activationLink.click();
    return popup;
  }
}
