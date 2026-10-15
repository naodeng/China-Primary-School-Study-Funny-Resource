import type { Locator, Page } from '@playwright/test';

export async function chooseSelectOption(page: Page, label: string, option: string, scope: Page | Locator = page) {
  await scope.getByRole('combobox', { name: label }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}
