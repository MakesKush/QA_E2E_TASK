import { BasePage } from './base-page';
import { RegistrationUser } from '../models/RegistrationUser';
import { logger } from '../utils/logger';

export class RegistrationPage extends BasePage {
  readonly title = this.page.getByText('Create Negotiator Account', { exact: true });
  readonly firstName = this.page.locator('[data-automation="first-name-input-layout-login"]');
  readonly lastName = this.page.locator('[data-automation="last-name-input-layout-login"]');
  readonly email = this.page.locator('[data-automation="email-input-layout-login"]');
  readonly password = this.page.locator('[data-automation="password-input-shared"]');
  readonly country = this.page.locator('[data-automation="country-of-residence-input-layout-login"]');
  readonly avatar = this.page.locator('img[src^="/files/user_avatars/"]');
  readonly saveButton = this.page.getByRole('button', { name: 'Save', exact: true });

  async fillRequiredFields(user: RegistrationUser): Promise<void> {
    logger.info('Fill first and last name');
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    logger.info(`Select country: ${user.country}`);
    await this.country.click();
    await this.page.getByText(user.country, { exact: true }).click();
    logger.info(`Fill email: ${user.email}`);
    await this.email.fill(user.email);
    logger.info('Fill registration password');
    await this.password.click();
    await this.password.fill(user.password);
  }

  async uploadAvatar(path: string): Promise<void> {
    logger.info('Open avatar editor');
    await this.page.locator('[data-automation="pencil-span-layout-login"]').click();
    logger.info('Upload avatar image');
    await this.page.locator('input[type="file"]').setInputFiles(path);
    logger.info('Apply avatar crop');
    await this.page.getByRole('button', { name: 'Use Photo', exact: true }).click();
  }

  async save(): Promise<void> {
    logger.info('Save negotiator account');
    await this.saveButton.click();
  }
}
