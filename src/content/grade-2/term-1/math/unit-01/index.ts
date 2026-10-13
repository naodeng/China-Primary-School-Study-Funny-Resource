import type { CurriculumUnit } from '../../../../types';
import { createPendingBasicTasks } from '../../../../sessionUtils';

const unitKey = 'grade-2/term-1/math/unit-01';

export const unit: CurriculumUnit = {
  id: unitKey,
  subject: 'math',
  title: '第一单元 · 长度单位',
  type: 'unit',
  formalUnitNumber: 1,
  achievementEligible: true,
  textbookEditionId: 'grade-2/term-1/math',
  sourceTopics: [
    '人教版小学数学二年级上册第一单元：长度单位',
    '厘米和米的认识及单位选择',
    '长度估测、直尺测量和线段的初步认识',
  ],
  difficultyTracks: {
    basic: {
      difficulty: 'basic',
      tasks: createPendingBasicTasks(unitKey, [
    {
      id: 'grade-2/term-1/math/unit-01/session-01',
      title: '厘米和米探险队',
      durationMinutes: 20,
      objective: '感受厘米和米的长度，能为常见物品选择合适的单位。',
      companionId: 'companion-01',
      activities: [
        {
          id: 'choose-unit',
          kind: 'choice',
          prompt: '测量一支铅笔的长度，用哪个单位更方便？',
          hint: '铅笔通常不会有一米那么长。',
          explanation: '较短的物体通常用厘米来量。',
          options: [
            { id: 'cm', label: '厘米（cm）' },
            { id: 'm', label: '米（m）' },
            { id: 'km', label: '千米（km）' },
          ],
          correctOptionId: 'cm',
        },
        {
          id: 'unit-sort',
          kind: 'categorize',
          prompt: '把物品放进更合适的测量单位组。',
          hint: '较小的东西用厘米，较长或较高的地方用米。',
          explanation: '选单位时先估一估物体大小，再选择更方便的单位。',
          categories: [
            { id: 'cm', label: '适合用厘米' },
            { id: 'm', label: '适合用米' },
          ],
          items: [
            { id: 'eraser', label: '橡皮的长边', categoryId: 'cm' },
            { id: 'book', label: '数学书的宽', categoryId: 'cm' },
            { id: 'door', label: '教室门的高度', categoryId: 'm' },
            { id: 'hall', label: '走廊的长度', categoryId: 'm' },
          ],
        },
        {
          id: 'meters-centimeters',
          kind: 'choice',
          prompt: '1米里面有多少个1厘米？',
          hint: '把1米想成100个一样长的小格子。',
          explanation: '1米等于100厘米。',
          options: [
            { id: '100', label: '100个' },
            { id: '10', label: '10个' },
            { id: '2', label: '2个' },
          ],
          correctOptionId: '100',
        },
        {
          id: 'pencil-measure',
          kind: 'measurement',
          prompt: '小尺子上有一支虚拟铅笔，请把尺子的终点调到合适位置。',
          hint: '从0刻度开始读，看看铅笔大约有多长。',
          explanation: '测量物体时，要把一端对准0刻度，再读另一端对应的刻度。',
          objectLabel: '虚拟铅笔',
          targetLengthCm: 8,
          minCm: 0,
          maxCm: 12,
        },
      ],
    },
    {
      id: 'grade-2/term-1/math/unit-01/session-02',
      title: '直尺和线段任务站',
      durationMinutes: 20,
      objective: '练习从0刻度测量长度，理解线段有两个端点并能比较长短。',
      companionId: 'companion-04',
      activities: [
        {
          id: 'measure-line',
          kind: 'measurement',
          prompt: '把直尺上的虚拟线段量一量，调出它的长度。',
          hint: '找准0刻度和线段终点之间的距离。',
          explanation: '线段两端都有端点，长度可以用直尺从0刻度量出来。',
          objectLabel: '蓝色线段',
          targetLengthCm: 6,
          minCm: 0,
          maxCm: 10,
        },
        {
          id: 'segment-feature',
          kind: 'choice',
          prompt: '下面哪句话说出了线段的重要特点？',
          hint: '线段是直直的，而且两头都能找到端点。',
          explanation: '线段是直的，有两个端点，可以测量长度。',
          options: [
            { id: 'endpoints', label: '直直的，有两个端点' },
            { id: 'curve', label: '弯弯的，没有端点' },
            { id: 'infinite', label: '可以一直向两边延长' },
          ],
          correctOptionId: 'endpoints',
        },
        {
          id: 'line-order',
          kind: 'order',
          prompt: '按从短到长排好这几段虚拟线段。',
          hint: '比较每段标出的厘米数。',
          explanation: '比较长度时，可以把单位统一后再从小到大排列。',
          items: [
            { id: 'line-3', label: '3厘米' },
            { id: 'line-5', label: '5厘米' },
            { id: 'line-8', label: '8厘米' },
            { id: 'line-11', label: '11厘米' },
          ],
          correctOrder: ['line-3', 'line-5', 'line-8', 'line-11'],
        },
        {
          id: 'estimate-pencil',
          kind: 'choice',
          prompt: '桌面宽约60厘米，下面哪种估测更合理？',
          hint: '桌面大约比一把短直尺宽一些。',
          explanation: '先用熟悉的物体作参照，再估测不熟悉的长度。',
          options: [
            { id: 'sixty', label: '大约60厘米' },
            { id: 'six', label: '大约6厘米' },
            { id: 'six-hundred', label: '大约600米' },
          ],
          correctOptionId: 'sixty',
        },
      ],
    },
  ]),
    },
    advanced: { difficulty: 'advanced', tasks: [] },
    high: { difficulty: 'high', tasks: [] },
  },
};
