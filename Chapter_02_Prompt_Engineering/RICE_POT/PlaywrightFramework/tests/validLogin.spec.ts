import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const SF_USERNAME = process.env.SF_USERNAME ?? '';
const SF_PASSWORD = process.env.SF_PASSWORD ?? '';
const LOGIN_PAGE_URL = /^https:\/\/login\.salesforce\.com\/(\?.*)?$/;
const INVALID_CREDENTIALS_ERROR = /Please check your username and password/;

test.describe('Salesforce Login - Valid Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.openUsernameLogin();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('failure-url', { body: page.url(), contentType: 'text/plain' });
    }
  });

  test('valid username advances to the password step', async ({ page }) => {
    const username = SF_USERNAME || 'valid.format.user@example.com';
    await test.step('Submit a username', async () => {
      await loginPage.submitUsername(username);
    });
    await test.step('Verify password step is shown for that username', async () => {
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(page.getByRole('img', { name: username })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Log In with a Different Username' })).toBeVisible();
    });
  });

  test('valid credentials log the user in', async ({ page }) => {
    test.skip(!SF_USERNAME || !SF_PASSWORD, 'Set SF_USERNAME and SF_PASSWORD in .env to run the valid-login test.');
    await test.step('Log in with valid credentials and remember me', async () => {
      await loginPage.login(SF_USERNAME, SF_PASSWORD, true);
    });
    await test.step('Verify the user has left the login page', async () => {
      await expect(page).not.toHaveURL(LOGIN_PAGE_URL, { timeout: 45_000 });
      await expect(loginPage.errorMessage(INVALID_CREDENTIALS_ERROR)).toBeHidden();
    });
  });
});
