import { unit as chineseUnit01 } from './grade-2/term-1/chinese/unit-01';
import { unit as chineseUnit02 } from './grade-2/term-1/chinese/unit-02';
import { unit as chineseUnit03 } from './grade-2/term-1/chinese/unit-03';
import { unit as chineseUnit04 } from './grade-2/term-1/chinese/unit-04';
import { unit as chineseUnit05 } from './grade-2/term-1/chinese/unit-05';
import { unit as chineseUnit06 } from './grade-2/term-1/chinese/unit-06';
import { unit as chineseUnit07 } from './grade-2/term-1/chinese/unit-07';
import { unit as chineseUnit08 } from './grade-2/term-1/chinese/unit-08';
import { unit as chineseTerm2Unit01 } from './grade-2/term-2/chinese/unit-01';
import { unit as chineseTerm2Unit02 } from './grade-2/term-2/chinese/unit-02';
import { unit as chineseTerm2Unit03 } from './grade-2/term-2/chinese/unit-03';
import { unit as chineseTerm2Unit04 } from './grade-2/term-2/chinese/unit-04';
import { unit as chineseTerm2Unit05 } from './grade-2/term-2/chinese/unit-05';
import { unit as chineseTerm2Unit06 } from './grade-2/term-2/chinese/unit-06';
import { unit as chineseTerm2Unit07 } from './grade-2/term-2/chinese/unit-07';
import { unit as chineseTerm2Unit08 } from './grade-2/term-2/chinese/unit-08';
import { unit as mathUnit01 } from './grade-2/term-1/math/unit-01';
import { unit as mathUnit02 } from './grade-2/term-1/math/unit-02';
import { unit as mathUnit03 } from './grade-2/term-1/math/unit-03';
import { unit as mathUnit04 } from './grade-2/term-1/math/unit-04';
import { unit as mathUnit05 } from './grade-2/term-1/math/unit-05';
import { unit as mathUnit06 } from './grade-2/term-1/math/unit-06';
import { unit as mathUnit07 } from './grade-2/term-1/math/unit-07';
import { unit as mathUnit08 } from './grade-2/term-1/math/unit-08';
import { unit as mathUnit09 } from './grade-2/term-1/math/unit-09';
import { unit as mathIntegratedPractice01 } from './grade-2/term-1/math/integrated-practice-01';
import { unit as mathTerm2Unit01 } from './grade-2/term-2/math/unit-01';
import { unit as mathTerm2Unit02 } from './grade-2/term-2/math/unit-02';
import { unit as mathTerm2Unit03 } from './grade-2/term-2/math/unit-03';
import { unit as mathTerm2Unit04 } from './grade-2/term-2/math/unit-04';
import { unit as mathTerm2Unit05 } from './grade-2/term-2/math/unit-05';
import { unit as mathTerm2Unit06 } from './grade-2/term-2/math/unit-06';
import { unit as mathTerm2Unit07 } from './grade-2/term-2/math/unit-07';
import { unit as mathTerm2Unit08 } from './grade-2/term-2/math/unit-08';
import { unit as mathTerm2Unit09 } from './grade-2/term-2/math/unit-09';
import { unit as mathTerm2Unit10 } from './grade-2/term-2/math/unit-10';
import { unit as mathTerm2IntegratedPractice01 } from './grade-2/term-2/math/integrated-practice-01';
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
                { id: 'unit-01', title: mathUnit01.title, status: 'active', type: 'unit', formalUnitNumber: 1, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit01.id },
                { id: 'unit-02', title: mathUnit02.title, status: 'active', type: 'unit', formalUnitNumber: 2, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit02.id },
                { id: 'unit-03', title: mathUnit03.title, status: 'active', type: 'unit', formalUnitNumber: 3, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit03.id },
                { id: 'unit-04', title: mathUnit04.title, status: 'active', type: 'unit', formalUnitNumber: 4, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit04.id },
                { id: 'unit-05', title: mathUnit05.title, status: 'active', type: 'unit', formalUnitNumber: 5, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit05.id },
                { id: 'unit-06', title: mathUnit06.title, status: 'active', type: 'unit', formalUnitNumber: 6, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit06.id },
                { id: 'unit-07', title: mathUnit07.title, status: 'active', type: 'unit', formalUnitNumber: 7, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit07.id },
                { id: 'unit-08', title: mathUnit08.title, status: 'active', type: 'unit', formalUnitNumber: 8, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit08.id },
                { id: 'unit-09', title: mathUnit09.title, status: 'active', type: 'unit', formalUnitNumber: 9, achievementEligible: true, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathUnit09.id },
                { id: 'integrated-practice-01', title: mathIntegratedPractice01.title, status: 'active', type: 'integrated-practice', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-1/math', curriculumUnitKey: mathIntegratedPractice01.id },
              ],
            },
          ],
        },
        {
          id: 'term-2',
          title: '下学期',
          subjects: [
            {
              id: 'chinese',
              title: '语文',
              units: [
                { id: 'unit-01', title: chineseTerm2Unit01.title, status: 'active', type: 'unit', formalUnitNumber: 1, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit01.id },
                { id: 'unit-02', title: chineseTerm2Unit02.title, status: 'active', type: 'unit', formalUnitNumber: 2, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit02.id },
                { id: 'unit-03', title: chineseTerm2Unit03.title, status: 'active', type: 'unit', formalUnitNumber: 3, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit03.id },
                { id: 'unit-04', title: chineseTerm2Unit04.title, status: 'active', type: 'unit', formalUnitNumber: 4, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit04.id },
                { id: 'unit-05', title: chineseTerm2Unit05.title, status: 'active', type: 'unit', formalUnitNumber: 5, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit05.id },
                { id: 'unit-06', title: chineseTerm2Unit06.title, status: 'active', type: 'unit', formalUnitNumber: 6, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit06.id },
                { id: 'unit-07', title: chineseTerm2Unit07.title, status: 'active', type: 'unit', formalUnitNumber: 7, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit07.id },
                { id: 'unit-08', title: chineseTerm2Unit08.title, status: 'active', type: 'unit', formalUnitNumber: 8, achievementEligible: true, textbookEditionId: 'grade-2/term-2/chinese', curriculumUnitKey: chineseTerm2Unit08.id },
              ],
            },
            {
              id: 'math',
              title: '数学',
              units: [
                { id: 'unit-01', title: mathTerm2Unit01.title, status: 'active', type: 'unit', formalUnitNumber: 1, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit01.id },
                { id: 'unit-02', title: mathTerm2Unit02.title, status: 'active', type: 'unit', formalUnitNumber: 2, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit02.id },
                { id: 'unit-03', title: mathTerm2Unit03.title, status: 'active', type: 'unit', formalUnitNumber: 3, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit03.id },
                { id: 'unit-04', title: mathTerm2Unit04.title, status: 'active', type: 'unit', formalUnitNumber: 4, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit04.id },
                { id: 'unit-05', title: mathTerm2Unit05.title, status: 'active', type: 'unit', formalUnitNumber: 5, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit05.id },
                { id: 'unit-06', title: mathTerm2Unit06.title, status: 'active', type: 'unit', formalUnitNumber: 6, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit06.id },
                { id: 'unit-07', title: mathTerm2Unit07.title, status: 'active', type: 'unit', formalUnitNumber: 7, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit07.id },
                { id: 'unit-08', title: mathTerm2Unit08.title, status: 'active', type: 'unit', formalUnitNumber: 8, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit08.id },
                { id: 'unit-09', title: mathTerm2Unit09.title, status: 'active', type: 'unit', formalUnitNumber: 9, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit09.id },
                { id: 'unit-10', title: mathTerm2Unit10.title, status: 'active', type: 'unit', formalUnitNumber: 10, achievementEligible: true, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2Unit10.id },
                { id: 'integrated-practice-01', title: mathTerm2IntegratedPractice01.title, status: 'active', type: 'integrated-practice', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-2/math', curriculumUnitKey: mathTerm2IntegratedPractice01.id },
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
    'grade-2/term-2/chinese/unit-01': chineseTerm2Unit01,
    'grade-2/term-2/chinese/unit-02': chineseTerm2Unit02,
    'grade-2/term-2/chinese/unit-03': chineseTerm2Unit03,
    'grade-2/term-2/chinese/unit-04': chineseTerm2Unit04,
    'grade-2/term-2/chinese/unit-05': chineseTerm2Unit05,
    'grade-2/term-2/chinese/unit-06': chineseTerm2Unit06,
    'grade-2/term-2/chinese/unit-07': chineseTerm2Unit07,
    'grade-2/term-2/chinese/unit-08': chineseTerm2Unit08,
    'grade-2/term-1/math/unit-01': mathUnit01,
    'grade-2/term-1/math/unit-02': mathUnit02,
    'grade-2/term-1/math/unit-03': mathUnit03,
    'grade-2/term-1/math/unit-04': mathUnit04,
    'grade-2/term-1/math/unit-05': mathUnit05,
    'grade-2/term-1/math/unit-06': mathUnit06,
    'grade-2/term-1/math/unit-07': mathUnit07,
    'grade-2/term-1/math/unit-08': mathUnit08,
    'grade-2/term-1/math/unit-09': mathUnit09,
    'grade-2/term-1/math/integrated-practice-01': mathIntegratedPractice01,
    'grade-2/term-2/math/unit-01': mathTerm2Unit01,
    'grade-2/term-2/math/unit-02': mathTerm2Unit02,
    'grade-2/term-2/math/unit-03': mathTerm2Unit03,
    'grade-2/term-2/math/unit-04': mathTerm2Unit04,
    'grade-2/term-2/math/unit-05': mathTerm2Unit05,
    'grade-2/term-2/math/unit-06': mathTerm2Unit06,
    'grade-2/term-2/math/unit-07': mathTerm2Unit07,
    'grade-2/term-2/math/unit-08': mathTerm2Unit08,
    'grade-2/term-2/math/unit-09': mathTerm2Unit09,
    'grade-2/term-2/math/unit-10': mathTerm2Unit10,
    'grade-2/term-2/math/integrated-practice-01': mathTerm2IntegratedPractice01,
  },
};
