import { unit as chineseUnit01 } from './grade-2/term-1/chinese/unit-01';
import { unit as chineseUnit02 } from './grade-2/term-1/chinese/unit-02';
import { unit as chineseUnit03 } from './grade-2/term-1/chinese/unit-03';
import { unit as chineseUnit04 } from './grade-2/term-1/chinese/unit-04';
import { unit as chineseUnit05 } from './grade-2/term-1/chinese/unit-05';
import { unit as chineseUnit06 } from './grade-2/term-1/chinese/unit-06';
import { unit as chineseUnit07 } from './grade-2/term-1/chinese/unit-07';
import { unit as chineseUnit08 } from './grade-2/term-1/chinese/unit-08';
import { unit as mathUnit01 } from './grade-2/term-1/math/unit-01';
import { unit as mathUnit02 } from './grade-2/term-1/math/unit-02';
import { textbooks } from './textbooks';
import type { Curriculum } from './types';

export const curriculum: Curriculum = {
  textbooks,
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
                { id: 'unit-01', title: chineseUnit01.title, status: 'active', type: 'unit', formalUnitNumber: 1, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit01.id },
                { id: 'unit-02', title: chineseUnit02.title, status: 'active', type: 'unit', formalUnitNumber: 2, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit02.id },
                { id: 'unit-03', title: chineseUnit03.title, status: 'active', type: 'unit', formalUnitNumber: 3, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit03.id },
                { id: 'unit-04', title: chineseUnit04.title, status: 'active', type: 'unit', formalUnitNumber: 4, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit04.id },
                { id: 'unit-05', title: chineseUnit05.title, status: 'active', type: 'unit', formalUnitNumber: 5, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit05.id },
                { id: 'unit-06', title: chineseUnit06.title, status: 'active', type: 'unit', formalUnitNumber: 6, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit06.id },
                { id: 'unit-07', title: chineseUnit07.title, status: 'active', type: 'unit', formalUnitNumber: 7, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit07.id },
                { id: 'unit-08', title: chineseUnit08.title, status: 'active', type: 'unit', formalUnitNumber: 8, achievementEligible: true, textbookEditionId: 'grade-2/term-1/chinese', curriculumUnitKey: chineseUnit08.id },
              ],
            },
            {
              id: 'math',
              title: '数学',
              units: [
                {
                  id: 'unit-01',
                  title: '第一单元 · 长度单位',
                  status: 'comingSoon',
                  type: 'unit',
                  formalUnitNumber: 1,
                  achievementEligible: true,
                  textbookEditionId: 'grade-2/term-1/math',
                  curriculumUnitKey: 'grade-2/term-1/math/unit-01',
                },
                {
                  id: 'unit-02',
                  title: '第二单元 · 100以内的加法和减法（二）',
                  status: 'comingSoon',
                  type: 'unit',
                  formalUnitNumber: 2,
                  achievementEligible: true,
                  textbookEditionId: 'grade-2/term-1/math',
                  curriculumUnitKey: 'grade-2/term-1/math/unit-02',
                },
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
    'grade-2/term-1/chinese/unit-03': chineseUnit03,
    'grade-2/term-1/chinese/unit-04': chineseUnit04,
    'grade-2/term-1/chinese/unit-05': chineseUnit05,
    'grade-2/term-1/chinese/unit-06': chineseUnit06,
    'grade-2/term-1/chinese/unit-07': chineseUnit07,
    'grade-2/term-1/chinese/unit-08': chineseUnit08,
    'grade-2/term-1/math/unit-01': mathUnit01,
    'grade-2/term-1/math/unit-02': mathUnit02,
  },
};
