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

    // 2. Verify Redirect to Login
    // We added `signOut()` so this should work now
    await expect(page).toHaveURL(/\/login/);

    // 3. Login
    await page.getByPlaceholder('name@example.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 4. Verify Redirect to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
