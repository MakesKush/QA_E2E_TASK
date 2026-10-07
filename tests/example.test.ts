import { test, expect } from '../fixtures/browser';
import { LoginPage } from '../pages/login-page';
import { config } from '../configs/config';
import { logger } from '../utils/logger';

test('Open Login Portal', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('Open login page', async () => {
    logger.info('Open the login portal');
    await loginPage.navigate('/user/login');
  });

  await test.step('Verify login portal is ready', async () => {
    await expect(page).toHaveURL(`${config.baseURL}/user/login`);
    await expect(loginPage.title).toBeVisible();
    await expect(loginPage.createAccountButton).toBeVisible();
  });
});
