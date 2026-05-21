import { test, expect } from '@playwright/test';

test('affichage de la page 404', async ({ page }) => {
  await page.goto('/page-qui-nexiste-pas');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});
