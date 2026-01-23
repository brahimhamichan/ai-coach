import { test, expect } from '@playwright/test';

test('signup and login flow', async ({ page }) => {
    // 1. Signup
    await page.goto('/signup');
    const uniqueId = Date.now();
    const name = `Test User ${uniqueId}`;
    const email = `test_${uniqueId}@example.com`;
    const password = 'password123';

    // Fill signup form
    await page.getByPlaceholder('John Doe').fill(name);
    await page.getByPlaceholder('name@example.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);

    // Submit
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 2. Verify Redirect to Onboarding (for new users)
    await expect(page).toHaveURL(/.*onboarding/);
    await expect(page.getByText('Welcome to AI Coach')).toBeVisible();
});
