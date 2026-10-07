import { resolve } from 'node:path';
import { test, expect } from '../fixtures/browser';
import { config, getMailcatcherCredentials } from '../configs/config';
import { createRegistrationUser } from '../data/registration-user';
import { LoginPage } from '../pages/login-page';
import { RegistrationPage } from '../pages/registration-page';
import { EmailConfirmationPage } from '../pages/email-confirmation-page';
import { MailcatcherPage } from '../pages/mailcatcher-page';
import { ProfilePage } from '../pages/profile-page';
import { logger } from '../utils/logger';

test.use({
  httpCredentials: {
    username: process.env.MAILCATCHER_USERNAME ?? '',
    password: process.env.MAILCATCHER_PASSWORD ?? '',
    origin: config.baseURL,
  },
});

test('Register a negotiator with an avatar and activate the account', async ({ page, context }, testInfo) => {
  test.setTimeout(config.registrationTimeout);
  getMailcatcherCredentials();

  const user = createRegistrationUser();
  const login = new LoginPage(page);
  const registration = new RegistrationPage(page);
  const confirmation = new EmailConfirmationPage(page);

  await test.step('Open negotiator registration from the login page', async () => {
    await login.navigate('/user/login');
    await expect(login.createAccountButton).toBeVisible();
    await login.createNegotiatorAccount();
    await expect(page).toHaveURL(`${config.baseURL}/user/registration`);
    await expect(registration.title).toBeVisible();
  });

  await test.step('Fill all required fields', async () => {
    await registration.fillRequiredFields(user);
    await expect(registration.firstName).toHaveValue(user.firstName);
    await expect(registration.lastName).toHaveValue(user.lastName);
    await expect(registration.email).toHaveValue(user.email);
  });

  await test.step('Upload and verify the avatar preview', async () => {
    await registration.uploadAvatar(resolve(__dirname, '../data/avatar.png'));
    await expect(registration.avatar).toBeVisible();
    await expect(registration.avatar).toHaveAttribute('src', /^\/files\/user_avatars\/.+\.png$/);
    await expect(registration.avatar).toHaveJSProperty('complete', true);
    await expect.poll(() => registration.avatar.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  });

  const avatarSource = await registration.avatar.getAttribute('src');
  if (!avatarSource) {
    throw new Error('Uploaded avatar has no source');
  }

  await test.step('Save the account and verify email confirmation', async () => {
    await expect(registration.saveButton).toBeEnabled();
    await registration.save();
    logger.info('Verify email confirmation page and recipient');
    await expect(page).toHaveURL(`${config.baseURL}/account/confirm/email`);
    await expect(confirmation.welcomeMessage).toBeVisible();
    await expect(confirmation.sentMessage).toHaveText(`A confirmation email has been sent to ${user.email}`);
  });

  const mailcatcher = new MailcatcherPage(await context.newPage());

  await test.step('Find and verify the registration email in MailCatcher', async () => {
    await mailcatcher.navigate('/mailcatcher/');
    await mailcatcher.openRegistrationMessage(user.email);
    logger.info('Verify registration email recipient and subject');
    await expect(mailcatcher.recipient).toHaveText(`<${user.email}>`);
    await expect(mailcatcher.subject).toHaveText(`${user.firstName} action required for your negotiation sim game registration`);
    await expect(mailcatcher.activationLink).toBeVisible();
  });

  const activatedPage = await test.step('Complete registration from the email', async () => {
    return mailcatcher.completeRegistration();
  });

  await test.step('Verify the activated profile and saved details', async () => {
    const profile = new ProfilePage(activatedPage);
    logger.info('Verify account activation and saved profile');
    await expect(activatedPage).toHaveURL(`${config.baseURL}/account/profile`);
    await expect(profile.activationMessage).toBeVisible();
    await expect(profile.firstName).toHaveValue(user.firstName);
    await expect(profile.lastName).toHaveValue(user.lastName);
    await expect(profile.headerAvatar).toBeVisible();
    await expect(profile.headerAvatar).toHaveAttribute('src', avatarSource);
    await testInfo.attach('activated-profile', {
      body: await activatedPage.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });
});
