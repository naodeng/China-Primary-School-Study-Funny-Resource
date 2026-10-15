import { expect, test } from '@playwright/test';
import { installAudioSpy, readAudioEvents } from './audioSpy';
import { curriculum } from '../../src/content/curriculum';
import type { ActivityDefinition } from '../../src/content/types';

const sessionUrl = '/grade-2/term-1/chinese/unit-01/basic/task-01/session-01';

async function setOrder(page: import('@playwright/test').Page, wanted: string[]) {
  const rows = page.getByRole('list', { name: '当前排列顺序' }).getByRole('listitem');
  for (let targetIndex = 0; targetIndex < wanted.length; targetIndex += 1) {
    const currentLabels = await rows.locator('.order-label').allTextContents();
    let itemIndex = currentLabels.indexOf(wanted[targetIndex]);
    if (itemIndex < targetIndex) throw new Error(`Cannot find order item: ${wanted[targetIndex]}`);
    while (itemIndex > targetIndex) {
      await rows.nth(itemIndex).locator('button[aria-label^="上移"]').click();
      itemIndex -= 1;
    }
  }
  await page.getByRole('button', { name: '检查顺序' }).click();
}

async function solveChoice(page: import('@playwright/test').Page, answer: string) {
  await page.getByRole('group', { name: '选择一个答案' }).getByRole('button', { name: answer, exact: true }).click();
  await page.getByRole('button', { name: '提交答案' }).click();
}

async function solveMatch(page: import('@playwright/test').Page, pairs: Array<[string, string]>) {
  const left = page.getByRole('group', { name: '左侧词语' });
  const right = page.getByRole('group', { name: '右侧词语' });
  for (const [leftText, rightText] of pairs) {
    await left.getByRole('button', { name: leftText }).click();
    await right.getByRole('button', { name: rightText }).click();
  }
  await page.getByRole('button', { name: '检查配对' }).click();
}

async function solveCategorize(page: import('@playwright/test').Page, pairs: Array<[string, string]>) {
  for (const [item, category] of pairs) {
    await page.getByRole('group', { name: `为${item}选择分类` }).getByRole('button', { name: category, exact: true }).click();
  }
  await page.getByRole('button', { name: '检查分类' }).click();
}

async function submitIncorrectAnswer(page: import('@playwright/test').Page, activity: ActivityDefinition) {
  if (activity.kind === 'choice') {
    const wrongOption = activity.options.find((option) => option.id !== activity.correctOptionId);
    if (!wrongOption) throw new Error(`Missing incorrect choice for ${activity.id}`);
    await solveChoice(page, wrongOption.label);
  } else if (activity.kind === 'match') {
    if (activity.pairs.length < 2) throw new Error(`Cannot construct an incorrect match for ${activity.id}`);
    await solveMatch(page, activity.pairs.map((pair, index) => [pair.left, activity.pairs[(index + 1) % activity.pairs.length].right]));
  } else if (activity.kind === 'order') {
    await page.getByRole('button', { name: '检查顺序' }).click();
  } else if (activity.kind === 'categorize') {
    if (activity.categories.length < 2) throw new Error(`Cannot construct an incorrect category for ${activity.id}`);
    const wrongCategories = activity.items.map((item) => {
      const wrong = activity.categories.find((category) => category.id !== item.categoryId);
      return [item.label, wrong?.label ?? ''] as [string, string];
    });
    await solveCategorize(page, wrongCategories);
  } else if (activity.kind === 'measurement') {
    const slider = page.getByRole('slider');
    const wrongValue = activity.targetLengthCm < activity.maxCm ? activity.targetLengthCm + 1 : activity.targetLengthCm - 1;
    await slider.focus();
    await slider.press('Home');
    for (let tick = activity.minCm; tick < wrongValue; tick += 1) await slider.press('ArrowRight');
    await page.getByRole('button', { name: '检查长度' }).click();
  } else {
    const wrongValue = activity.correctAnswer < 99 ? activity.correctAnswer + 1 : activity.correctAnswer - 1;
    await page.getByRole('spinbutton', { name: '输入计算结果' }).fill(String(wrongValue));
    await page.getByRole('button', { name: '检查答案' }).click();
  }
  await expect(page.locator('.activity-feedback')).toContainText(/这次还没|勇敢尝试|还差|先别|每一次尝试/);
  await page.getByRole('button', { name: '再试一次' }).click();
  await page.getByRole('button', { name: '给我一点提示' }).click();
  await expect(page.locator('.activity-guidance')).toContainText('小提示：');
}

async function solveActivity(page: import('@playwright/test').Page, activity: ActivityDefinition) {
  if (activity.kind === 'choice') {
    const answer = activity.options.find((option) => option.id === activity.correctOptionId);
    if (!answer) throw new Error(`Missing answer option for ${activity.id}`);
    await solveChoice(page, answer.label);
  } else if (activity.kind === 'match') {
    await solveMatch(page, activity.pairs.map((pair) => [pair.left, pair.right]));
  } else if (activity.kind === 'order') {
    const labels = new Map(activity.items.map((item) => [item.id, item.label]));
    await setOrder(page, activity.correctOrder.map((id) => labels.get(id) ?? ''));
  } else if (activity.kind === 'categorize') {
    const labels = new Map(activity.categories.map((category) => [category.id, category.label]));
    await solveCategorize(page, activity.items.map((item) => [item.label, labels.get(item.categoryId) ?? '']));
  } else if (activity.kind === 'measurement') {
    const slider = page.getByRole('slider');
    await slider.focus();
    await slider.press('Home');
    for (let tick = activity.minCm; tick < activity.targetLengthCm; tick += 1) await slider.press('ArrowRight');
    await page.getByRole('button', { name: '检查长度' }).click();
  } else {
    await page.getByRole('spinbutton', { name: '输入计算结果' }).fill(String(activity.correctAnswer));
    await page.getByRole('button', { name: '检查答案' }).click();
  }
  await expect(page.locator('.activity-feedback')).toBeVisible();
}

async function continueToNext(page: import('@playwright/test').Page, final = false) {
  await expect(page.locator('.activity-feedback')).toBeVisible();
  await page.getByRole('button', { name: final ? /^完成本场/ : /^继续下一题/ }).click();
}

test('alignsChoiceLabelsBesideLetterMarkersOnPhoneAndDesktop', async ({ page }) => {
  await installAudioSpy(page);
  const session = '/grade-2/term-1/chinese/unit-02/basic/task-01/session-01';

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(session);
    const option = page.getByRole('group', { name: '选择一个答案' }).getByRole('button').first();
    const marker = option.locator('.choice-option-letter');
    const label = option.locator('.choice-option-label');
    const markerBox = await marker.boundingBox();
    const labelBox = await label.boundingBox();

    expect(markerBox).not.toBeNull();
    expect(labelBox).not.toBeNull();
    expect(labelBox!.x).toBeGreaterThan(markerBox!.x + markerBox!.width);
    expect(Math.abs((labelBox!.y + labelBox!.height / 2) - (markerBox!.y + markerBox!.height / 2))).toBeLessThan(7);
  }
});

test('playsAnswerCuesInOrderAndSavesEightQuestionProgress', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto(sessionUrl);
  await expect(page.getByText('挑战 1 / 8')).toBeVisible();

  await page.getByRole('button', { name: '给我一点提示' }).click();
  await expect(page.getByText(/小提示：/)).toBeVisible();
  await page.getByRole('button', { name: '检查顺序' }).click();
  await expect(page.getByRole('status')).toContainText(/没关系|勇敢尝试|换个角度|别着急|每一次尝试/);
  await page.getByRole('button', { name: '再试一次' }).click();
  await setOrder(page, ['还是一只小蝌蚪', '先长出后腿', '再长出前腿', '尾巴逐渐变短']);
  await continueToNext(page);

  await solveChoice(page, '它正在长大');
  await page.evaluate(() => {
    const values = [0, 0];
    Math.random = () => values.shift() ?? 0;
  });
  await continueToNext(page);

  const rightColumn = page.getByRole('group', { name: '右侧词语' });
  const initialRightOrder = await rightColumn.getByRole('button').allTextContents();
  expect(initialRightOrder).not.toEqual(['身体较小，尾巴明显', '腿逐渐长出来', '尾巴慢慢变短']);
  const leftColumn = page.getByRole('group', { name: '左侧词语' });
  const wrongPairs: Array<[string, string]> = [
    ['刚开始', '腿逐渐长出来'],
    ['成长中', '尾巴慢慢变短'],
    ['接近长大', '身体较小，尾巴明显'],
  ];
  for (const [leftText, rightText] of wrongPairs) {
    await leftColumn.getByRole('button', { name: leftText }).click();
    await rightColumn.getByRole('button', { name: rightText }).click();
  }
  await page.getByRole('button', { name: '检查配对' }).click();
  await expect(page.locator('.activity-feedback')).toContainText(/这次还没|勇敢尝试|还差|先别|每一次尝试/);
  await page.evaluate(() => {
    const values = [0.999, 0];
    Math.random = () => values.shift() ?? 0;
  });
  await page.getByRole('button', { name: '再试一次' }).click();
  expect(await rightColumn.getByRole('button').allTextContents()).not.toEqual(initialRightOrder);
  await solveMatch(page, [
    ['刚开始', '身体较小，尾巴明显'],
    ['成长中', '腿逐渐长出来'],
    ['接近长大', '尾巴慢慢变短'],
  ]);
  await continueToNext(page);

  await solveCategorize(page, [
    ['尾巴变短了', '看到的'],
    ['它可能快长大了', '猜想的'],
    ['长出了两条腿', '看到的'],
    ['它也许会去浅水边', '猜想的'],
  ]);
  await continueToNext(page);

  await solveChoice(page, '先说开始，再说变化，最后说结果');
  await continueToNext(page);

  await setOrder(page, ['说出想知道的问题', '仔细观察', '整理线索', '记录发现']);
  await continueToNext(page);

  await solveChoice(page, '回到已有记录中比较');
  await continueToNext(page);

  await solveMatch(page, [
    ['先后词', '说明事情顺序'],
    ['观察词', '说清看到的特点'],
    ['因为……所以……', '说明简单原因'],
  ]);
  await continueToNext(page, true);

  await expect(page.getByRole('heading', { name: '太棒了，能量收集完成！' })).toBeVisible();
  const answerCues = (await readAudioEvents(page))
    .filter((event) => event.type === 'play' && /answer-(correct|streak|incorrect)|session-complete/.test(event.src))
    .map((event) => event.src);
  expect(answerCues).toEqual([
    '/audio/answer-incorrect.mp3',
    '/audio/answer-correct.mp3',
    '/audio/answer-streak.mp3',
    '/audio/answer-incorrect.mp3',
    '/audio/answer-correct.mp3',
    ...Array.from({ length: 4 }, () => '/audio/answer-streak.mp3'),
    '/audio/session-complete.mp3',
  ]);
  expect((await readAudioEvents(page)).some((event) => event.type === 'play' && event.src === '/audio/interaction-click.mp3')).toBe(true);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('china-study-progress-v1') ?? '{}').completedSessionIds))
    .toContain('grade-2/term-1/chinese/unit-01/basic/task-01/session-01');
});

test('keepsAnsweringWhenBrowserRejectsAudioPlayback', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto(sessionUrl);
  await page.evaluate(() => localStorage.setItem('__china_study_reject_next_audio', 'true'));
  await expect(page.getByRole('list', { name: '当前排列顺序' })).toBeVisible();
  await page.getByRole('button', { name: '检查顺序' }).click();
  await expect(page.getByRole('status')).toContainText(/没关系|勇敢尝试|换个角度|别着急|每一次尝试/);
  await page.getByRole('button', { name: '再试一次' }).click();
  await setOrder(page, ['还是一只小蝌蚪', '先长出后腿', '再长出前腿', '尾巴逐渐变短']);
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('button', { name: /^继续下一题/ })).toBeEnabled();
});

test('playsInteractionCuesForArithmeticAndMeasurementInputs', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/grade-2/term-1/math/unit-02/basic/task-01/session-01');
  const answer = page.getByRole('spinbutton', { name: '输入计算结果' });
  await answer.click();

  const arithmeticClickCount = (await readAudioEvents(page))
    .filter((event) => event.type === 'play' && event.src === '/audio/interaction-click.mp3').length;
  expect(arithmeticClickCount).toBe(1);
  await answer.fill('36');
  await page.getByRole('button', { name: '检查答案' }).click();
  await expect(page.locator('.activity-feedback')).toContainText(/这次还没|勇敢尝试|还差|先别|每一次尝试/);
  await page.getByRole('button', { name: '再试一次' }).click();
  await page.getByRole('button', { name: '给我一点提示' }).click();
  await answer.fill('37');
  await page.getByRole('button', { name: '检查答案' }).click();
  await expect(page.getByRole('status')).toContainText(/答对了|真棒|太好了|成功啦/);

  await page.goto('/grade-2/term-1/math/unit-01/basic/task-01/session-01');
  await solveChoice(page, '厘米');
  await continueToNext(page);
  await solveChoice(page, '米');
  await continueToNext(page);
  await solveCategorize(page, [
    ['橡皮的长边', '厘米'],
    ['课桌的高度', '米'],
    ['数学书的宽', '厘米'],
    ['走廊的长度', '米'],
  ]);
  await continueToNext(page);

  const increaseLength = page.getByRole('button', { name: '增加 1 厘米' });
  await expect(increaseLength).toBeVisible();
  await increaseLength.click();
  const clickCountWithMeasurement = (await readAudioEvents(page))
    .filter((event) => event.type === 'play' && event.src === '/audio/interaction-click.mp3').length;
  expect(clickCountWithMeasurement).toBeGreaterThan(arithmeticClickCount);

  for (let tick = 1; tick < 9; tick += 1) await increaseLength.click();
  await page.getByRole('button', { name: '检查长度' }).click();
  await expect(page.locator('.activity-feedback')).toContainText(/这次还没|勇敢尝试|还差|先别|每一次尝试/);
  await page.getByRole('button', { name: '再试一次' }).click();
  await page.getByRole('button', { name: '给我一点提示' }).click();
  for (let tick = 1; tick < 9; tick += 1) await increaseLength.click();
  await expect(page.locator('.measurement-value')).toHaveText('8 厘米');
  await page.getByRole('button', { name: '检查长度' }).click();
  await expect(page.locator('.activity-feedback')).toContainText(/答对了|真棒|太好了|成功啦/);
});

test('showsCorrectPlaceValuesAndAcceptsAThreeDigitArithmeticAnswer', async ({ page }) => {
  await installAudioSpy(page);
  await page.goto('/grade-2/term-2/math/unit-08/basic/task-02/session-01');

  await solveChoice(page, '3000');
  await continueToNext(page);
  await solveChoice(page, '2');
  await continueToNext(page);

  const operands = page.locator('.place-number');
  await expect(operands.nth(0)).toContainText('百位');
  await expect(operands.nth(0)).toContainText('6');
  await expect(operands.nth(1)).toContainText('百位');
  await expect(operands.nth(1)).toContainText('3');

  const answer = page.getByRole('spinbutton', { name: '输入计算结果' });
  await expect(answer).toHaveAttribute('max', '999');
  await answer.fill('900');
  await page.getByRole('button', { name: '检查答案' }).click();
  await expect(page.locator('.activity-feedback')).toContainText(/成功|答对|真棒|太好了/);
});

test('completesTwoBasicTasksAndOneTaskPerHigherTier', async ({ page }) => {
  await installAudioSpy(page);
  const unit = curriculum.units['grade-2/term-1/math/unit-02'];
  if (!unit) throw new Error('The second term-one math unit is missing from the verified curriculum.');
  const tasks = [
    ...unit.difficultyTracks.basic.tasks.slice(0, 2).map((task) => ({ difficulty: 'basic', task })),
    ...unit.difficultyTracks.advanced.tasks.map((task) => ({ difficulty: 'advanced', task })),
    ...unit.difficultyTracks.high.tasks.map((task) => ({ difficulty: 'high', task })),
  ];
  const retriedKinds = new Set<ActivityDefinition['kind']>();

  for (let taskIndex = 0; taskIndex < tasks.length; taskIndex += 1) {
    const { task } = tasks[taskIndex];
    const session = task.sessions[0];
    await page.goto(`/${session.id}`);
    for (let activityIndex = 0; activityIndex < session.activities.length; activityIndex += 1) {
      const activity = session.activities[activityIndex];
      if (!retriedKinds.has(activity.kind)) {
        await submitIncorrectAnswer(page, activity);
        retriedKinds.add(activity.kind);
      }
      await solveActivity(page, activity);
      await continueToNext(page, activityIndex === session.activities.length - 1);
    }
    await expect(page.getByRole('heading', { name: '太棒了，能量收集完成！' })).toBeVisible();

    if (taskIndex < 2) {
      await page.goto('/achievements');
      const unitProgress = page.locator('.achievement-unit').filter({ hasText: unit.title });
      await expect(unitProgress).toContainText(`${taskIndex + 1} / 2`);
      await expect(unitProgress).toHaveClass(taskIndex === 0 ? /is-pending/ : /is-complete/);
    }
  }

  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('china-study-progress-v1') ?? '{}').completedSessionIds))
    .toHaveLength(4);
});
