import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  static readonly PATH = '/?locale=in';
  static readonly USERNAME_PATH = '/?login=1&locale=in';

  readonly page: Page;
  readonly emailLoginHeading: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly emailRememberMeCheckbox: Locator;
  readonly logInWithUsernameLink: Locator;
  readonly usernameLoginHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly useCustomDomainLink: Locator;
  readonly logInWithEmailLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailLoginHeading = page.getByRole('heading', { name: 'Log In with Email', level: 1 });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.emailRememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember Me', exact: true });
    this.logInWithUsernameLink = page.getByRole('link', { name: 'Log In with Username' });
    this.usernameLoginHeading = page.getByRole('heading', { name: 'Salesforce login', level: 1 });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Log In', exact: true });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me', exact: true });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Your Password?' });
    this.useCustomDomainLink = page.getByRole('link', { name: 'Use Custom Domain' });
    this.logInWithEmailLink = page.getByRole('link', { name: 'Log In with Email' });
  }

  async open(): Promise<void> {
    await this.page.goto(LoginPage.PATH, { waitUntil: 'load' });
    await expect(this.emailLoginHeading).toBeVisible();
  }

  async openUsernameLogin(): Promise<void> {
    await this.page.goto(LoginPage.USERNAME_PATH, { waitUntil: 'load' });
    await expect(this.usernameLoginHeading).toBeVisible();
  }

  async switchToUsernameLogin(): Promise<void> {
    await this.logInWithUsernameLink.click();
    await this.page.waitForLoadState('load');
    await expect(this.usernameLoginHeading).toBeVisible();
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async submitUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await expect(this.usernameInput).toHaveValue(username);
    await this.loginButton.click();
  }

  async submitPassword(password: string): Promise<void> {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.passwordInput).toHaveValue(password);
    await this.loginButton.click();
  }

  async setRememberMe(checked: boolean): Promise<void> {
    await this.rememberMeCheckbox.setChecked(checked);
  }

  async login(username: string, password: string, rememberMe = false): Promise<void> {
    await this.setRememberMe(rememberMe);
    await this.submitUsername(username);
    await this.submitPassword(password);
  }

  errorMessage(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }
}
