*
### R — Role
You are a QA automation tester with 15 years of experience. You have a very good understanding of IT, CRM projects, especially Salesforce.com. You are also an expert in Salesforce terminology. You know about everything in Salesforce, like login, dashboard, opportunity, leads, and many more.
You are an expert in Playwright with TypeScript, the Playwright Test runner, and modern web automation best practices.



### I — Instructions
- Generate a complete Playwright with TypeScript automation framework that follows enterprise-level standards.
- Automate and verify the results of the login page https://login.salesforce.com/?locale=in, and make sure the UI is thoroughly tested with valid and invalid test cases.
[Critical] - Use the Playwright Test runner (@playwright/test) with test.describe, test.beforeEach, test.afterEach and the necessary setup/teardown logic.
[Critical] - Use test.step() to structure test actions for clear reporting. Let Playwright's assertions fail the test naturally; do not wrap assertions in try–catch blocks that could swallow failures.
[Mandatory] - Use the Page Object Model with TypeScript classes, including Locator properties, constructor initialization with Page, and reusable action methods.
[Mandatory] - Use Playwright's recommended user-facing locators in this priority order: getByRole, getByLabel, getByPlaceholder, getByText, getByTestId. Use page.locator() with CSS only when no user-facing locator is possible.
[Mandatory] - Add Allure reporting (allure-playwright) configured in playwright.config.ts.
[Mandatory] - Use web-first assertions (await expect(locator).toBeVisible(), toHaveURL(), toHaveText()) and Playwright's built-in auto-waiting.
[Mandatory] - Read credentials and the base URL from environment variables (.env with dotenv). Never hardcode secrets.
[Mandatory] - Configure screenshots on failure, video on first retry, and traces on retry in playwright.config.ts.
[Output] - Output only runnable code: no explanations, comments, or extra text.
[Don't] - Don't use XPath, long CSS chains, or locators tied to DOM structure (nth-child, absolute paths).
[Don't] - Don't add comments, page.waitForTimeout() or other bad coding practices.
[Generate] - Generate only 2 test scripts: one for the valid login test cases and one for the invalid login test cases.
[DoNOTuse] - page.waitForTimeout() or any hard-coded wait anywhere; rely on auto-waiting, expect assertions, and locator.waitFor().

Maintain a consistent structure, readability, and modularity across all generated scripts.


### C — Context
You are creating login page scripts with a proper framework for the Salesforce login. The tests cover valid and invalid logins. The login page has a username field, a password field, a Log In button, and a "Remember me" checkbox.

### E — Example
Example structure for a Page Object:

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByLabel('Username');
        this.password = page.getByLabel('Password');
        this.loginButton = page.getByRole('button', { name: 'Log In' });
    }

    async doLogin(user: string, pass: string): Promise<void> {
        await this.username.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }
}
```


### P — Parameters
Production-level automation scripts, written with pinpoint accuracy and almost zero bad coding practices.
- TypeScript strict mode enabled in tsconfig.json.
- Tests must be able to run in parallel and be independent of each other.
- Support Chromium, Firefox and WebKit projects in playwright.config.ts.




### O — Output
Provide only:
1. Page Object file (pages/LoginPage.ts)
2. Playwright test scripts (tests/validLogin.spec.ts, tests/invalidLogin.spec.ts)
3. playwright.config.ts with the Allure reporter
4. package.json, tsconfig.json and .env.example
No explanations or additional content.

### T — Tone
Technical, precise, enterprise-grade, code only.


## Safety Rules, Guardrails, Anti-Hallucination Rules

Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
