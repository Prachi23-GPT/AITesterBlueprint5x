package com.aitesterblueprint.salesforce;

import java.time.Duration;
import java.util.List;
import java.util.Objects;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginPage {
    private static final Duration WAIT_TIMEOUT = Duration.ofSeconds(20);
    private static final By LOGIN_ERROR = By.xpath(
            "//*[@role='alert' or @id='error' or contains(@class,'error') or contains(@class,'Error')]");

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//input[@type='text' or @type='email' or @name='username' or @autocomplete='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@type='password' or @name='pw' or @autocomplete='current-password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@type='checkbox']")
    private List<WebElement> rememberMeCheckboxes;

    @FindBy(xpath = "//button[normalize-space(.)='Log In' or normalize-space(.)='Continue'] | //input[@type='submit' and (@value='Log In' or @value='Continue')]")
    private WebElement submitButton;

    public LoginPage(WebDriver driver) {
        this.driver = Objects.requireNonNull(driver, "driver must not be null");
        this.wait = new WebDriverWait(driver, WAIT_TIMEOUT);
        PageFactory.initElements(driver, this);
    }

    public void login(String username, String password, boolean rememberMe) throws WebDriverException {
        Objects.requireNonNull(username, "username must not be null");
        Objects.requireNonNull(password, "password must not be null");

        wait.until(webDriver -> isDisplayed(usernameInput) || isDisplayed(passwordInput));
        if (isDisplayed(usernameInput)) {
            usernameInput.clear();
            usernameInput.sendKeys(username);
            setRememberMe(rememberMe);
            clickSubmit();
        }

        if (!isDisplayed(passwordInput)) {
            wait.until(webDriver -> isDisplayed(passwordInput) || isLoginErrorVisible());
        }

        if (isDisplayed(passwordInput)) {
            passwordInput.clear();
            passwordInput.sendKeys(password);
            clickSubmit();
        }
    }

    public String waitForLoginError() throws WebDriverException {
        return wait.until(webDriver -> {
            List<WebElement> visibleErrors = webDriver.findElements(LOGIN_ERROR).stream()
                    .filter(WebElement::isDisplayed)
                    .toList();
            if (visibleErrors.isEmpty()) {
                return null;
            }
            String message = visibleErrors.get(0).getText().trim();
            return message.isEmpty() ? null : message;
        });
    }

    public boolean waitForAuthenticatedRedirect() throws WebDriverException {
        return wait.until(webDriver -> !webDriver.getCurrentUrl().contains("login.salesforce.com"));
    }

    private void setRememberMe(boolean selected) {
        for (WebElement checkbox : rememberMeCheckboxes) {
            if (checkbox.isDisplayed()) {
                if (checkbox.isSelected() != selected) {
                    checkbox.click();
                }
                if (checkbox.isSelected() != selected) {
                    throw new IllegalStateException("The Remember Me checkbox did not reach the requested state.");
                }
                return;
            }
        }
        throw new NoSuchElementException("The Remember Me checkbox was not found.");
    }

    private void clickSubmit() throws WebDriverException {
        wait.until(webDriver -> isDisplayed(submitButton));
        submitButton.click();
    }

    private boolean isLoginErrorVisible() {
        return driver.findElements(LOGIN_ERROR).stream().anyMatch(WebElement::isDisplayed);
    }

    private boolean isDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (org.openqa.selenium.NoSuchElementException | org.openqa.selenium.StaleElementReferenceException exception) {
            return false;
        }
    }
}
