import { expect, test } from '@playwright/test';

test('loads catalog and refreshes a nested unit', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '星岛学习站' })).toBeVisible();

  await page.goto('/grade-2/term-1/chinese/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeVisible();
  await page.reload();

  await expect(page.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeVisible();
});
