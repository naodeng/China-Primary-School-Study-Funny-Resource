import { expect, test } from '@playwright/test';

test('loads catalog and refreshes a nested unit', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '星岛学园 · Starry Island' })).toBeVisible();

  await page.goto('/grade-2/term-1/english/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · My Family' })).toBeVisible();

  await page.goto('/grade-2/term-1/english/review-01');
  await expect(page.getByRole('heading', { name: '复习一 · Units 1–3' })).toBeVisible();

  await page.goto('/grade-2/term-1/math/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · 长度单位' })).toBeVisible();

  await page.goto('/grade-2/term-1/math/integrated-practice-01');
  await expect(page.getByRole('heading', { name: '综合实践 · 量一量，比一比' })).toBeVisible();

  await page.goto('/grade-2/term-2/math/unit-10');
  await expect(page.getByRole('heading', { name: '第十单元 · 总复习' })).toBeVisible();

  await page.goto('/grade-2/term-2/math/integrated-practice-01');
  await expect(page.getByRole('heading', { name: '综合实践 · 小小设计师' })).toBeVisible();

  await page.goto('/grade-2/term-2/english/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · Playtime' })).toBeVisible();

  await page.goto('/grade-2/term-2/english/review-01');
  await expect(page.getByRole('heading', { name: '复习一 · Units 1–3' })).toBeVisible();

  await page.goto('/grade-2/term-1/chinese/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeVisible();
  await page.reload();

  await expect(page.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeVisible();
});
