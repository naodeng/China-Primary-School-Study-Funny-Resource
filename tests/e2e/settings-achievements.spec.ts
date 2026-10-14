import { expect, test } from '@playwright/test';
import { installAudioSpy, readAudioEvents } from './audioSpy';

test('persistsThemeLearningStartAndSoundPreference', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/');
  await page.getByRole('button', { name: '设置' }).click();
  await expect(page.getByRole('switch', { name: '语音提示与交互音效' })).toBeChecked();
  await page.getByRole('radio', { name: '深色' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('dialog').getByRole('combobox', { name: '学期' }).selectOption('2');
  await page.getByRole('dialog').getByRole('combobox', { name: '从第几单元开始' }).selectOption('1');
  await page.getByRole('button', { name: '应用学习起点' }).click();
  await expect(page.getByText('已更新学习起点，星图也同步点亮啦！')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('china-study-progress-v1') ?? '{}').learningStart))
    .toEqual({ grade: 2, term: 2, unit: 1 });
  await page.getByRole('dialog').getByRole('button', { name: '查看成就详情' }).click();
  await expect(page).toHaveURL(/\/achievements$/);
  await expect(page.getByRole('heading', { name: '我的成就星图' })).toBeVisible();

  await page.goto('/');
  await page.getByRole('button', { name: '设置' }).click();
  const soundSwitch = page.getByRole('switch', { name: '语音提示与交互音效' });
  const pausesBeforeMute = (await readAudioEvents(page)).filter((event) => event.type === 'pause').length;
  const playsBeforeMute = (await readAudioEvents(page)).filter((event) => event.type === 'play').length;
  await soundSwitch.click();
  await expect(soundSwitch).not.toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('china-study-sound-enabled-v1'))).toBe('false');
  await expect.poll(async () => (await readAudioEvents(page)).filter((event) => event.type === 'play').length).toBe(playsBeforeMute);
  await page.getByRole('button', { name: '关闭' }).click();
  expect((await readAudioEvents(page)).filter((event) => event.type === 'pause').length).toBeGreaterThan(pausesBeforeMute);

  await page.reload();
  await page.getByRole('button', { name: '设置' }).click();
  await expect(page.getByRole('switch', { name: '语音提示与交互音效' })).not.toBeChecked();
  expect((await readAudioEvents(page)).filter((event) => event.type === 'play')).toHaveLength(playsBeforeMute);
});

test('doesNotPlayForDisabledOrAriaDisabledControls', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/grade-2/term-1/chinese/unit-01/basic/task-01/session-01');
  await page.evaluate(() => {
    const control = document.createElement('button');
    control.id = 'aria-disabled-sound-check';
    control.setAttribute('aria-disabled', 'true');
    document.querySelector('.app-frame')?.appendChild(control);
  });
  const disabledContinue = page.getByRole('button', { name: /^继续下一题/ });
  await disabledContinue.evaluate((element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await page.locator('#aria-disabled-sound-check').evaluate((element) => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  expect((await readAudioEvents(page)).filter((event) => event.type === 'play')).toHaveLength(0);
});
