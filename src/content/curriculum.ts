import { unit as chineseUnit01 } from './grade-2/term-1/chinese/unit-01';
import { unit as chineseUnit02 } from './grade-2/term-1/chinese/unit-02';
import { unit as mathUnit01 } from './grade-2/term-1/math/unit-01';
import { unit as mathUnit02 } from './grade-2/term-1/math/unit-02';
import type { Curriculum } from './types';

export const curriculum: Curriculum = {
  grades: [
    {
      id: 'grade-2',
      title: '二年级',
      terms: [
        {
          id: 'term-1',
          title: '上学期',
          subjects: [
            {
              id: 'chinese',
              title: '语文',
              units: [
                {
                  id: 'unit-01',
                  title: '第一单元 · 阅读',
                  status: 'active',
                  curriculumUnitKey: 'grade-2/term-1/chinese/unit-01',
                },
                {
                  id: 'unit-02',
                  title: '第二单元 · 识字',
                  status: 'active',
                  curriculumUnitKey: 'grade-2/term-1/chinese/unit-02',
                },
                { id: 'unit-03', title: '第三单元（筹备中）', status: 'comingSoon' },
              ],
            },
            {
              id: 'math',
              title: '数学',
              units: [
                {
                  id: 'unit-01',
                  title: '第一单元 · 长度单位',
                  status: 'active',
                  curriculumUnitKey: 'grade-2/term-1/math/unit-01',
                },
                {
                  id: 'unit-02',
                  title: '第二单元 · 100以内的加法和减法（二）',
                  status: 'active',
                  curriculumUnitKey: 'grade-2/term-1/math/unit-02',
                },
                { id: 'unit-03', title: '第三单元（筹备中）', status: 'comingSoon' },
              ],
            },
          ],
        },
      ],
    },
  ],
  units: {
    'grade-2/term-1/chinese/unit-01': chineseUnit01,
    'grade-2/term-1/chinese/unit-02': chineseUnit02,
    'grade-2/term-1/math/unit-01': mathUnit01,
    'grade-2/term-1/math/unit-02': mathUnit02,
  },
};
