import { BasePage } from './base-page';

export class ProfilePage extends BasePage {
  readonly activationMessage = this.page.getByText(/You[’']ve successfully\s+activated your account/);
  readonly firstName = this.page.locator('[data-automation="enter-first-name-input-layout-user"]');
  readonly lastName = this.page.locator('[data-automation="enter-last-name-input-layout-user"]');
  readonly headerAvatar = this.page.locator('[data-automation="user-div-layout-user"] img');
}
