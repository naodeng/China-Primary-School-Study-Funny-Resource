import { expect, test } from '@playwright/test';
import { installAudioSpy } from './audioSpy';
import { curriculum } from '../../src/content/curriculum';

test('showsAllThreeTaskTiersAndOpensARegisteredLearningSession', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/grade-2/term-1/chinese/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeVisible();

  await expect(page.locator('.difficulty-track--basic')).toContainText('3 个任务');
  await expect(page.locator('.difficulty-track--advanced')).toContainText('1 个任务');
  await expect(page.locator('.difficulty-track--high')).toContainText('1 个任务');
  await page.locator('.difficulty-track--basic').getByRole('button', { name: '查看任务' }).first().click();
  await expect(page).toHaveURL(/\/grade-2\/term-1\/chinese\/unit-01\/basic\/task-01$/);
  await expect(page.getByRole('heading', { name: '学习场次' })).toBeVisible();
  await expect(page.getByText('8 个挑战')).toBeVisible();
});

test('rendersEveryVerifiedCourseEntryAndOpensItsUnit', async ({ page }) => {
  await installAudioSpy(page);
  for (const grade of curriculum.grades) {
    for (const term of grade.terms) {
      for (const subject of term.subjects) {
        const verifiedEntries = subject.units.filter((entry) => entry.status === 'active'
          && curriculum.textbooks[entry.textbookEditionId]?.verificationStatus === 'verified');
        await page.goto('/');
        await page.getByRole('combobox', { name: '年级' }).selectOption(grade.id);
        await page.getByRole('combobox', { name: '学期' }).selectOption(term.id);
        await page.getByRole('button', { name: subject.title, exact: true }).click();
        await expect(page.getByRole('button', { name: /进入单元/ })).toHaveCount(verifiedEntries.length);
        for (const entry of verifiedEntries) {
          await expect(page.getByText(entry.title, { exact: true })).toBeVisible();
        }
        for (const entry of verifiedEntries) {
          await page.goto(`/${grade.id}/${term.id}/${subject.id}/${entry.id}`);
          await expect(page.getByRole('heading', { name: entry.title })).toBeVisible();
        }
      }
    }
  }
});

test('supportsKeyboardFocusReducedMotionAndNarrowScreens', async ({ page }) => {
  await installAudioSpy(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.matches(':focus-visible'))).toBe(true);
  await page.evaluate(() => {
    const target = window as Window & { __studyScrollBehaviors: Array<ScrollBehavior | undefined> };
    target.__studyScrollBehaviors = [];
    window.scrollTo = ((options?: ScrollToOptions) => target.__studyScrollBehaviors.push(options?.behavior)) as typeof window.scrollTo;
  });
  await page.getByRole('button', { name: /进入单元/ }).first().click();
  await expect(page).toHaveURL(/\/grade-2\/term-1\/chinese\/unit-\d+$/);
  expect(await page.evaluate(() => (window as Window & { __studyScrollBehaviors: Array<ScrollBehavior | undefined> }).__studyScrollBehaviors))
    .toContain('auto');

  await page.goto('/unknown-study-route');
  await expect(page.getByRole('heading', { name: '没有找到这门课程' })).toBeVisible();
});
