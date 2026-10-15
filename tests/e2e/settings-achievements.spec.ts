import { expect, test } from '@playwright/test';
import { installAudioSpy, readAudioEvents } from './audioSpy';
import { chooseSelectOption } from './selectOption';

test('persistsThemeLearningStartAndSoundPreference', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/');
  await page.getByRole('button', { name: '设置' }).click();
  const settingsDialog = page.getByRole('dialog');
  await expect(page.getByRole('switch', { name: '语音提示与交互音效' })).toBeChecked();
  await page.getByRole('radio', { name: '深色' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await chooseSelectOption(page, '学期', '下学期', settingsDialog);
  await chooseSelectOption(page, '从第几单元开始', '第 1 单元', settingsDialog);
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

test('keepsAchievementDetailsSkimmableAcrossPhoneTabletAndDesktop', async ({ page }) => {
  await installAudioSpy(page);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/achievements');
    await expect(page.getByRole('heading', { name: '我的成就星图' })).toBeVisible();
    await expect(page.locator('.exploration-zone')).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    const horizontalPadding = await page.locator('.achievement-page').evaluate((element) => ({
      left: Number.parseFloat(getComputedStyle(element).paddingLeft),
      right: Number.parseFloat(getComputedStyle(element).paddingRight),
    }));
    expect(horizontalPadding.left).toBeGreaterThanOrEqual(viewport.width <= 700 ? 14 : 24);
    expect(horizontalPadding.right).toBeGreaterThanOrEqual(viewport.width <= 700 ? 14 : 24);

    const responsiveZoneToggle = page.getByRole('button', { name: /第3星区的单元进度/ });
    const zoneToggleBounds = await responsiveZoneToggle.boundingBox();
    if (viewport.width <= 1024) expect(zoneToggleBounds?.height).toBeGreaterThanOrEqual(44);
    await responsiveZoneToggle.click();
    await expect(responsiveZoneToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#exploration-zone-units-3')).toBeVisible();
    await responsiveZoneToggle.click();
    await expect(responsiveZoneToggle).toHaveAttribute('aria-expanded', 'false');
    if (viewport.width <= 1024) {
      const recordToggle = await page.getByRole('button', { name: /二年级上学期语文进度/ }).boundingBox();
      expect(recordToggle?.height).toBeGreaterThanOrEqual(44);
    }
  }

  const zoneToggle = page.getByRole('button', { name: /第3星区的单元进度/ });
  await expect(zoneToggle).toHaveAttribute('aria-expanded', 'false');
  await zoneToggle.focus();
  await page.keyboard.press('Enter');
  await expect(zoneToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#exploration-zone-units-3')).toBeVisible();

  const chineseToggle = page.getByRole('button', { name: /二年级上学期语文进度/ });
  const mathToggle = page.getByRole('button', { name: /二年级上学期数学进度/ });
  await chineseToggle.click();
  await expect(chineseToggle).toHaveAttribute('aria-expanded', 'true');
  const chineseGroup = page.locator(`#${await chineseToggle.getAttribute('aria-controls')}`);
  await expect(chineseGroup).toBeVisible();
  await expect(chineseGroup.locator('.achievement-unit')).toHaveCount(8);
  await mathToggle.click();
  await expect(mathToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(chineseToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(chineseGroup).toBeHidden();
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
