import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const INVALID_USERNAME = 'invalid.user.pw.automation@example.com';
const INVALID_PASSWORD = 'InvalidPass#12345';
const MISSING_USERNAME_ERROR = 'Error: Please enter your username.';
const INVALID_CREDENTIALS_ERROR = /Please check your username and password/;
const UNKNOWN_EMAIL_ERROR = "We couldn't find your login details.";
const EMAIL_PAGE_SKIP_REASON = "Salesforce email login page loads its bundle over http://:443, which Firefox and WebKit block under the page CSP.";

test.describe('Salesforce Login - Invalid Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('failure-url', { body: page.url(), contentType: 'text/plain' });
    }
  });

  test('email login page renders all UI elements and links to username login', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', EMAIL_PAGE_SKIP_REASON);
    await test.step('Open the Salesforce login page', async () => {
      await loginPage.open();
    });
    await test.step('Verify page title and elements', async () => {
      await expect(page).toHaveTitle('Log In with Email | Salesforce');
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'Enter your email address...');
      await expect(loginPage.continueButton).toBeEnabled();
      await expect(loginPage.emailRememberMeCheckbox).toBeChecked();
      await expect(loginPage.logInWithUsernameLink).toBeVisible();
    });
    await test.step('Navigate to username login', async () => {
      await loginPage.switchToUsernameLogin();
      await expect(loginPage.usernameInput).toBeVisible();
    });
  });

  test('username login page renders all UI elements', async ({ page }) => {
    await test.step('Switch to username login', async () => {
      await loginPage.openUsernameLogin();
    });
    await test.step('Verify page title and elements', async () => {
      await expect(page).toHaveTitle('Login | Salesforce');
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.loginButton).toBeEnabled();
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.useCustomDomainLink).toBeVisible();
      await expect(loginPage.logInWithEmailLink).toBeVisible();
    });
  });

  test('remember me checkbox can be toggled', async () => {
    await loginPage.openUsernameLogin();
    await test.step('Check remember me', async () => {
      await loginPage.setRememberMe(true);
      await expect(loginPage.rememberMeCheckbox).toBeChecked();
    });
    await test.step('Uncheck remember me', async () => {
      await loginPage.setRememberMe(false);
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    });
  });

  test('submitting an empty username shows a validation error', async () => {
    await loginPage.openUsernameLogin();
    await test.step('Submit without a username', async () => {
      await loginPage.submitUsername('');
    });
    await test.step('Verify missing username error', async () => {
      await expect(loginPage.errorMessage(MISSING_USERNAME_ERROR)).toBeVisible();
      await expect(loginPage.passwordInput).toBeHidden();
    });
  });

  test('password field masks the entered value', async () => {
    await loginPage.openUsernameLogin();
    await loginPage.submitUsername(INVALID_USERNAME);
    await test.step('Verify password input is masked', async () => {
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test('invalid username and password shows an authentication error', async () => {
    await loginPage.openUsernameLogin();
    await test.step('Log in with invalid credentials', async () => {
      await loginPage.login(INVALID_USERNAME, INVALID_PASSWORD);
    });
    await test.step('Verify invalid credentials error', async () => {
      await expect(loginPage.errorMessage(INVALID_CREDENTIALS_ERROR)).toBeVisible();
      await expect(loginPage.usernameLoginHeading).toBeVisible();
    });
  });

  test('unknown email on the email login page shows an error', async ({ browserName }) => {
    test.skip(browserName !== 'chromium', EMAIL_PAGE_SKIP_REASON);
    await loginPage.open();
    await test.step('Submit an unregistered email', async () => {
      await loginPage.submitEmail(INVALID_USERNAME);
    });
    await test.step('Verify unknown email error', async () => {
      await expect(loginPage.errorMessage(UNKNOWN_EMAIL_ERROR)).toBeVisible();
    });
  });
});
