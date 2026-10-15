import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { installAudioSpy } from './audioSpy';
import { chooseSelectOption } from './selectOption';

const curriculumManifest = JSON.parse(readFileSync(new URL('../../src/content/curriculum-manifest.json', import.meta.url), 'utf8'));

test('showsCompactHomeExplorationProgressAndOpensAchievementDetails', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/');

  const hero = page.locator('.catalog-hero');
  await expect(hero.getByText('我的探索进度')).toBeVisible();
  await expect(hero.getByRole('progressbar', { name: /距离月球开拓者的进度/ })).toBeVisible();
  await expect(page.locator('.catalog-hero-crew .achievement-summary-card')).toBeVisible();
  await expect(page.locator('.project-legal-footer--page')).toContainText('© 2026');
  await expect(page.getByRole('link', { name: 'naodeng 的个人网站' })).toHaveAttribute('href', 'https://inaodeng.com');
  await hero.getByRole('button', { name: /成就详情/ }).click();

  await expect(page).toHaveURL(/\/achievements$/);
  await expect(page.getByRole('heading', { name: '我的成就星图' })).toBeVisible();
});

test('updatesTheHighlightedCourseAndMovesKeyboardFocusToItsSelectors', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/');

  const currentRoute = page.locator('.catalog-current-route');
  await expect(currentRoute).toContainText('1年级');
  await expect(currentRoute).toContainText('上学期');
  await expect(currentRoute).toContainText('语文');
  await expect(currentRoute).toContainText('人教版');
  await page.getByRole('button', { name: /调整课程选择/ }).click();
  await expect(page.getByRole('group', { name: '选择学习年级和学期' })).toBeFocused();

  await chooseSelectOption(page, '学期', '下学期');
  await page.getByRole('button', { name: '英语', exact: true }).click();
  await expect(currentRoute).toContainText('下学期');
  await expect(currentRoute).toContainText('英语');
});

test('showsAllThreeTaskTiersAndOpensARegisteredLearningSession', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/grade-2/term-1/chinese/unit-01');
  await expect(page.getByRole('heading', { name: '第一单元 · 大自然的秘密' })).toBeVisible();

  await expect(page.locator('.difficulty-track--basic')).toContainText('3 个任务');
  await expect(page.locator('.difficulty-track--advanced')).toContainText('2 个任务');
  await expect(page.locator('.difficulty-track--high')).toContainText('2 个任务');
  await page.locator('.difficulty-track--basic').getByRole('button', { name: '查看任务' }).first().click();
  await expect(page).toHaveURL(/\/grade-2\/term-1\/chinese\/unit-01\/basic\/task-01$/);
  await expect(page.getByRole('heading', { name: '学习场次' })).toBeVisible();
  await expect(page.getByText('8 个挑战')).toBeVisible();
  await page.getByRole('button', { name: /出发前复习知识点/ }).click();
  await expect(page.getByRole('region', { name: '本任务知识点回顾' }).getByRole('listitem')).toHaveCount(4);
});

test('shows second advanced and high tasks across Chinese math and English', async ({ page }) => {
  await installAudioSpy(page);
  const samples = [
    'grade-2/term-1/chinese/unit-01',
    'grade-2/term-2/math/unit-02',
    'grade-2/term-2/english/unit-01',
  ];

  for (const unitKey of samples) {
    for (const difficulty of ['advanced', 'high'] as const) {
      await page.goto(`/${unitKey}`);
      const track = page.locator(`.difficulty-track--${difficulty}`);
      const taskSlug = 'task-02';
      const expectedPath = `/${unitKey}/${difficulty}/${taskSlug}`;

      await expect(track).toContainText('2 个任务');
      await expect(track.getByRole('button', { name: '查看任务' })).toHaveCount(2);
      await track.getByRole('button', { name: '查看任务' }).nth(1).click();
      await expect(page).toHaveURL(new RegExp(`${expectedPath.replaceAll('/', '\\/')}$`));
      const secondTaskTitle = await page.getByRole('heading', { level: 1 }).textContent();
      expect(secondTaskTitle).toBeTruthy();

      await page.goto(expectedPath);
      await expect(page.getByRole('heading', { name: secondTaskTitle!, level: 1 })).toBeVisible();
      await page.reload();
      await expect(page.getByRole('heading', { name: secondTaskTitle!, level: 1 })).toBeVisible();
      await expect(page.getByText('8 个挑战')).toBeVisible();
      await page.getByRole('button', { name: '开始第 1 场' }).click();
      await expect(page).toHaveURL(/\/session-01$/);
      await expect(page.getByRole('region', { name: '挑战进度' })).toContainText('挑战 1 / 8');
    }
  }
});


test('keepsUnitTaskAndSessionScreensReadableAcrossPhoneTabletAndDesktop', async ({ page }) => {
  await installAudioSpy(page);
  const routes = [
    {
      url: '/grade-2/term-1/chinese/unit-01',
      heading: '第一单元 · 大自然的秘密',
    },
    {
      url: '/grade-2/term-1/chinese/unit-01/basic/task-01',
      heading: '成长观察站',
      reviewHeading: '本任务知识点回顾',
    },
    {
      url: '/grade-2/term-1/chinese/unit-01/basic/task-01/session-01',
      heading: '成长观察站',
    },
  ];

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route.url);
      await expect(page.getByRole('heading', { name: route.heading, level: 1 })).toBeVisible();
      if ('reviewHeading' in route) {
        await expect(page.getByRole('button', { name: /出发前复习知识点/ })).toBeVisible();
        await page.getByRole('button', { name: /出发前复习知识点/ }).click();
        await expect(page.getByRole('heading', { name: route.reviewHeading })).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    }
  }
});

test('keepsMobileStudyActionsWithinReachAndUsesReadableAlignedIconsInBothThemes', async ({ page }) => {
  await installAudioSpy(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/grade-2/term-1/chinese/unit-01');

  const unitDock = page.locator('.mobile-study-dock');
  await expect(unitDock).toBeVisible();
  const unitDockBounds = await unitDock.boundingBox();
  expect(unitDockBounds?.y).toBeGreaterThan(0);
  expect(unitDockBounds!.y + unitDockBounds!.height).toBeLessThanOrEqual(844);
  await unitDock.getByRole('button', { name: '开始基础任务' }).click();
  await expect(page).toHaveURL(/\/grade-2\/term-1\/chinese\/unit-01\/basic\/task-01$/);

  const taskDock = page.locator('.mobile-study-dock');
  await expect(taskDock).toBeVisible();
  await taskDock.getByRole('button', { name: /第 1 场$/ }).click();
  await expect(page).toHaveURL(/\/grade-2\/term-1\/chinese\/unit-01\/basic\/task-01\/session-01$/);

  const submitAction = page.locator('.activity-submit-action').first();
  await expect(submitAction).toBeVisible();
  const submitBounds = await submitAction.boundingBox();
  expect(submitBounds?.y).toBeGreaterThan(0);
  expect(submitBounds!.y + submitBounds!.height).toBeLessThanOrEqual(844);

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/grade-2/term-1/chinese/unit-01');
  await expect(page.locator('.mobile-study-dock')).toBeVisible();
  const tabletDockBounds = await page.locator('.mobile-study-dock').boundingBox();
  expect(tabletDockBounds!.y + tabletDockBounds!.height).toBeLessThanOrEqual(1024);

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator('.mobile-study-dock')).toBeHidden();

  await page.goto('/');
  for (const theme of ['light', 'dark']) {
    await page.evaluate((preference) => localStorage.setItem('china-study-theme-v1', preference), theme);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const metrics = await page.locator('.catalog-settings-button').evaluate((button) => {
      const icon = button.querySelector('span[class*="animal-btn-icon"] svg');
      const label = Array.from(button.children).find((child) => !(child instanceof HTMLElement && child.className.includes('animal-btn-icon')));
      if (!(icon instanceof SVGElement) || !(label instanceof HTMLElement)) return null;
      const iconBounds = icon.closest('span')!.getBoundingClientRect();
      const labelBounds = label.getBoundingClientRect();
      const textColor = getComputedStyle(button).color;
      const iconOutline = icon.querySelector('[stroke]') ?? icon;
      const iconColor = getComputedStyle(iconOutline).stroke;
      const iconFillElement = icon.querySelector('[fill="#264653" i]');
      const iconFill = iconFillElement ? getComputedStyle(iconFillElement).fill : null;
      const backgroundColor = getComputedStyle(button).backgroundColor;
      const channels = (value: string) => (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const luminance = (value: string) => channels(value).map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index]!, 0);
      const foreground = luminance(textColor);
      const background = luminance(backgroundColor);
      const paintContrast = (paint: string) => (Math.max(luminance(paint), background) + 0.05) / (Math.min(luminance(paint), background) + 0.05);
      return {
        centerOffset: Math.abs((iconBounds.top + iconBounds.height / 2) - (labelBounds.top + labelBounds.height / 2)),
        iconColor,
        textColor,
        contrast: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
        iconContrast: paintContrast(iconColor),
        iconFillContrast: iconFill ? paintContrast(iconFill) : null,
      };
    });
    expect(metrics).not.toBeNull();
    expect(metrics!.centerOffset).toBeLessThanOrEqual(2);
    expect(metrics!.contrast).toBeGreaterThanOrEqual(4.5);
    expect(metrics!.iconContrast).toBeGreaterThanOrEqual(4.5);
    expect(metrics!.iconFillContrast).toBeGreaterThanOrEqual(4.5);
  }
});

test('rendersEveryVerifiedCourseEntryAndOpensItsUnit', async ({ page }) => {
  test.setTimeout(300_000);
  await installAudioSpy(page);
  for (const grade of curriculumManifest.grades) {
    for (const term of grade.terms) {
      for (const subject of term.subjects) {
        const verifiedEntries = subject.units.filter((entry) => entry.status === 'active'
          && curriculumManifest.textbooks[entry.textbookEditionId]?.verificationStatus === 'verified');
        await page.goto('/');
        await expect(page.getByRole('heading', { name: '星岛学园 · Starry Island' })).toBeVisible();
        await chooseSelectOption(page, '年级', grade.title);
        await chooseSelectOption(page, '学期', term.title);
        await page.getByRole('button', { name: subject.title, exact: true }).click();
        await expect(page.getByRole('button', { name: /进入单元/ })).toHaveCount(verifiedEntries.length);
        for (const entry of verifiedEntries) {
          await expect(page.getByText(entry.title, { exact: true })).toBeVisible();
        }
        for (const entry of verifiedEntries) {
          await page.goto(`/${grade.id}/${term.id}/${subject.id}/${entry.id}`);
          await expect(page.getByRole('heading', { name: entry.title, exact: true })).toBeVisible();
        }
      }
    }
  }
});

test('keepsCatalogAndSettingsUsableOnPhoneTabletAndDesktop', async ({ page }) => {
  await installAudioSpy(page);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '星岛学园 · Starry Island' })).toBeVisible();
    await expect(page.getByRole('button', { name: /进入单元/ }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    if (viewport.width <= 1024) {
      const routeAction = await page.locator('.catalog-current-route-action').boundingBox();
      const achievementAction = await page.locator('.catalog-hero-crew .achievement-summary-card').getByRole('button', { name: /成就详情/ }).boundingBox();
      expect(routeAction?.height).toBeGreaterThanOrEqual(44);
      expect(achievementAction?.height).toBeGreaterThanOrEqual(44);
    }
    if (viewport.width === 390) {
      const companionName = page.locator('.companion-roster-member').first().locator(':scope > span').last();
      await expect(companionName).toBeVisible();
      expect(await companionName.evaluate((element) => getComputedStyle(element).fontSize)).toBe('11px');
    }

    await page.getByRole('button', { name: '设置' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.project-legal-footer--dialog')).toContainText('PolyForm Noncommercial License 1.0.0');
    await expect(dialog.getByRole('heading', { name: '学习进度设置' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '应用学习起点' })).toBeVisible();
    if (viewport.width === 390) {
      const themeLabel = page.locator('.settings-modal .theme-switcher-options [class*="animal-radioItem"] [class*="animal-label"]').first();
      const dimensions = await themeLabel.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          height: element.getBoundingClientRect().height,
          fontSize: Number.parseFloat(style.fontSize),
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        };
      });
      expect(dimensions.height).toBeLessThan(dimensions.fontSize * 1.6);
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    }

    const geometry = await page.evaluate((viewportWidth) => {
      const modal = document.querySelector('.settings-modal > [class*="animal-modalClipped"]');
      const body = document.querySelector('.settings-modal [class*="animal-body"]');
      if (!(modal instanceof HTMLElement) || !(body instanceof HTMLElement)) return null;
      const bounds = modal.getBoundingClientRect();
      return {
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        bottom: bounds.bottom,
        width: viewportWidth,
        height: window.innerHeight,
        bodyCanScroll: body.scrollHeight > body.clientHeight,
      };
    }, viewport.width);
    expect(geometry).not.toBeNull();
    expect(geometry!.left).toBeGreaterThanOrEqual(0);
    expect(geometry!.right).toBeLessThanOrEqual(geometry!.width);
    expect(geometry!.top).toBeGreaterThanOrEqual(0);
    expect(geometry!.bottom).toBeLessThanOrEqual(geometry!.height);
    if (viewport.width === 390) expect(geometry!.bodyCanScroll).toBe(true);

    if (viewport.width === 390) {
      await page.locator('.settings-modal [class*="animal-body"]').evaluate((element) => {
        element.scrollTop = element.scrollHeight;
      });
      const closeBounds = await dialog.getByRole('button', { name: '关闭设置' }).boundingBox();
      expect(closeBounds?.y).toBeGreaterThanOrEqual(0);
      expect(closeBounds!.y + closeBounds!.height).toBeLessThanOrEqual(viewport.height);
    }

    await page.getByRole('button', { name: '关闭设置' }).click();
    await expect(dialog).toBeHidden();
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
  await expect(page).toHaveURL(/\/grade-1\/term-1\/chinese\/unit-\d+$/);
  expect(await page.evaluate(() => (window as Window & { __studyScrollBehaviors: Array<ScrollBehavior | undefined> }).__studyScrollBehaviors))
    .toContain('auto');

  await page.goto('/unknown-study-route');
  await expect(page.getByRole('heading', { name: '没有找到这门课程' })).toBeVisible();
});
