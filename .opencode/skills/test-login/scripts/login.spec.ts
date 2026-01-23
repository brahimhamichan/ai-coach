import { test, expect } from '@playwright/test';

const TEST_USER = {
    email: 'brahim@scalingadventures.com',
    password: 'brahim123'
};

test.use({ colorScheme: 'dark' });

test('Login or Signup', async ({ page }) => {
    try {
        console.log('Navigating to /login...');
        await page.goto('/login', { waitUntil: 'domcontentloaded' });

        await page.screenshot({ path: 'login_initial_dark.png', fullPage: true });
        console.log('Initial dark mode screenshot saved');

        if (page.url().includes('/chat')) {
            console.log('Already logged in');
            return;
        }

        const emailInput = page.locator('input#email');
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });

        console.log(`Entering email: ${TEST_USER.email}`);
        await emailInput.fill(TEST_USER.email);

        const continueBtn = page.locator('button[type="submit"]').filter({ hasText: /Continue|Submit/i });
        await continueBtn.click();
        console.log('Clicked continue after email');

        // Check for password input or if we are already redirected to signup
        await page.waitForTimeout(3000);

        const passwordInput = page.locator('input#password');
        const isPasswordVisible = await passwordInput.isVisible();

        if (isPasswordVisible) {
            console.log('Login path detected, entering password...');
            await passwordInput.fill(TEST_USER.password);
            await page.locator('button[type="submit"]').filter({ hasText: /Continue|Log in|Submit/i }).click();

            // Check for errors
            await page.waitForTimeout(3000);
            const errorText = await page.innerText('body');
            if (errorText.includes('Invalid') || errorText.includes('Error')) {
                console.log(`Error detected: ${errorText.split('\n').filter(l => l.includes('Invalid') || l.includes('Error'))[0]}`);
                if (errorText.includes('Invalid email or password')) {
                    console.log('User might not exist. Attempting signup...');
                    await page.goto('/signup');
                }
            }
        }

        const isSignup = page.url().includes('/signup') || (await page.innerText('body')).includes('Create your account');

        if (isSignup) {
            console.log('Signup path detected');
            if (!page.url().includes('/signup')) {
                await page.goto('/signup');
            }
            await page.locator('input#email').waitFor({ state: 'visible' });
            await page.fill('input#email', TEST_USER.email);
            await page.fill('input#password', TEST_USER.password);
            await page.locator('button[type="submit"]').filter({ hasText: /Create account|Sign up/i }).click();
            console.log('Clicked create account');
        }

        console.log('Waiting for final redirect to /chat...');
        await expect(page).toHaveURL(/\/chat/, { timeout: 20000 });
        console.log('Successfully reached /chat');
    } catch (error) {
        console.error('Test failed:', error);
        await page.screenshot({ path: 'login_failure_dark.png', fullPage: true });
        console.log('Failure screenshot saved as login_failure_dark.png');
        throw error;
    }
});
