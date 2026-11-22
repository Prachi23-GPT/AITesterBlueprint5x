package com.aitesterblueprint.salesforce;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.SkipException;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import io.qameta.allure.Description;
import io.qameta.allure.Feature;
import io.qameta.allure.Story;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

@Feature("Salesforce login")
public class LoginTests {
    private static final String LOGIN_URL = "https://login.salesforce.com/?login=1&locale=in";
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeTest(alwaysRun = true)
    public void setUp() throws WebDriverException {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        if (Boolean.parseBoolean(System.getProperty("browser.headless", "false"))) {
            options.addArguments("--headless=new");
        }

        driver = new ChromeDriver(options);
        driver.manage().timeouts().pageLoadTimeout(java.time.Duration.ofSeconds(45));
        driver.manage().timeouts().implicitlyWait(java.time.Duration.ZERO);
        loginPage = new LoginPage(driver);
    }

    @BeforeMethod(alwaysRun = true)
    public void openLoginPage() throws WebDriverException {
        driver.get(LOGIN_URL);
    }

    @Test(priority = 1)
    @Story("Valid credentials")
    @Description("Verifies that supplied Salesforce credentials redirect away from the login page.")
    public void validLogin() throws WebDriverException {
        String username = System.getenv("SF_USERNAME");
        String password = System.getenv("SF_PASSWORD");
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new SkipException("Set SF_USERNAME and SF_PASSWORD to run the valid-login test.");
        }

        loginPage.login(username, password, true);

        assertTrue(loginPage.waitForAuthenticatedRedirect(),
                "A successful login should redirect away from login.salesforce.com.");
    }

    @Test(priority = 2)
    @Story("Invalid credentials")
    @Description("Verifies that an invalid Salesforce username and password produce a visible login error.")
    public void invalidLogin() throws WebDriverException {
        loginPage.login("selenium.invalid.user@example.invalid", "Invalid-Password-Only", false);

        String errorMessage = loginPage.waitForLoginError();
        assertFalse(errorMessage.isBlank(), "The invalid-login error message should not be empty.");
    }

    @AfterTest(alwaysRun = true)
    public void tearDown() throws WebDriverException {
        if (driver != null) {
            driver.quit();
        }
    }
}
