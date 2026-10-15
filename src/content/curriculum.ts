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
import { unit as englishTerm1Unit01 } from './grade-2/term-1/english/unit-01';
import { unit as englishTerm1Unit02 } from './grade-2/term-1/english/unit-02';
import { unit as englishTerm1Unit03 } from './grade-2/term-1/english/unit-03';
import { unit as englishTerm1Review01 } from './grade-2/term-1/english/review-01';
import { unit as englishTerm1Unit04 } from './grade-2/term-1/english/unit-04';
import { unit as englishTerm1Unit05 } from './grade-2/term-1/english/unit-05';
import { unit as englishTerm1Unit06 } from './grade-2/term-1/english/unit-06';
import { unit as englishTerm1Review02 } from './grade-2/term-1/english/review-02';
import { unit as englishTerm2Unit01 } from './grade-2/term-2/english/unit-01';
import { unit as englishTerm2Unit02 } from './grade-2/term-2/english/unit-02';
import { unit as englishTerm2Unit03 } from './grade-2/term-2/english/unit-03';
import { unit as englishTerm2Review01 } from './grade-2/term-2/english/review-01';
import { unit as englishTerm2Unit04 } from './grade-2/term-2/english/unit-04';
import { unit as englishTerm2Unit05 } from './grade-2/term-2/english/unit-05';
import { unit as englishTerm2Unit06 } from './grade-2/term-2/english/unit-06';
import { unit as englishTerm2Review02 } from './grade-2/term-2/english/review-02';
import { addedCourseCatalog } from './grade-1-and-3/catalog';
import { textbooks } from './textbooks';
import type { Curriculum, CurriculumUnit, SubjectId } from './types';

const addedCourseModules = import.meta.glob<CurriculumUnit>(
  ['./grade-1/term-*/**/index.ts', './grade-3/term-*/**/index.ts'],
  { eager: true, import: 'unit' },
);

export function getAddedCourseUnit(id: string): CurriculumUnit {
  const unit = addedCourseModules[`./${id}/index.ts`];
  if (!unit) throw new Error(`课程目录已登记但缺少条目模块：${id}`);
  return unit;
}

function buildAddedGrade(gradeNumber: 1 | 3): Curriculum['grades'][number] {
  const gradeId = `grade-${gradeNumber}` as const;
  return {
    id: gradeId,
    title: `${gradeNumber}年级`,
    terms: ([1, 2] as const).map((termNumber) => ({
      id: `term-${termNumber}` as const,
      title: termNumber === 1 ? '上学期' : '下学期',
      subjects: (['chinese', 'math', 'english'] as const).map((subjectId: SubjectId) => ({
        id: subjectId,
        title: subjectId === 'chinese' ? '语文' : subjectId === 'math' ? '数学' : '英语',
        units: addedCourseCatalog
          .filter((entry) => entry.grade === gradeNumber && entry.term === termNumber && entry.subject === subjectId)
          .map((entry) => ({
            id: entry.slug,
            title: entry.title,
            status: 'active' as const,
            type: entry.type,
            formalUnitNumber: entry.formalUnitNumber,
            achievementEligible: entry.type === 'unit' && entry.formalUnitNumber !== null,
            textbookEditionId: `grade-${gradeNumber}/term-${termNumber}/${subjectId}`,
            curriculumUnitKey: entry.id,
          })),
      })),
    })),
  };
}

export const curriculum: Curriculum = {
  textbooks,
  grades: [
    buildAddedGrade(1),
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
            {
              id: 'english',
              title: '英语',
              units: [
                { id: 'unit-01', title: englishTerm1Unit01.title, status: 'active', type: 'unit', formalUnitNumber: 1, achievementEligible: true, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Unit01.id },
                { id: 'unit-02', title: englishTerm1Unit02.title, status: 'active', type: 'unit', formalUnitNumber: 2, achievementEligible: true, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Unit02.id },
                { id: 'unit-03', title: englishTerm1Unit03.title, status: 'active', type: 'unit', formalUnitNumber: 3, achievementEligible: true, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Unit03.id },
                { id: 'review-01', title: englishTerm1Review01.title, status: 'active', type: 'review', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Review01.id },
                { id: 'unit-04', title: englishTerm1Unit04.title, status: 'active', type: 'unit', formalUnitNumber: 4, achievementEligible: true, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Unit04.id },
                { id: 'unit-05', title: englishTerm1Unit05.title, status: 'active', type: 'unit', formalUnitNumber: 5, achievementEligible: true, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Unit05.id },
                { id: 'unit-06', title: englishTerm1Unit06.title, status: 'active', type: 'unit', formalUnitNumber: 6, achievementEligible: true, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Unit06.id },
                { id: 'review-02', title: englishTerm1Review02.title, status: 'active', type: 'review', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-1/english', curriculumUnitKey: englishTerm1Review02.id },
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
            {
              id: 'english',
              title: '英语',
              units: [
                { id: 'unit-01', title: englishTerm2Unit01.title, status: 'active', type: 'unit', formalUnitNumber: 1, achievementEligible: true, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Unit01.id },
                { id: 'unit-02', title: englishTerm2Unit02.title, status: 'active', type: 'unit', formalUnitNumber: 2, achievementEligible: true, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Unit02.id },
                { id: 'unit-03', title: englishTerm2Unit03.title, status: 'active', type: 'unit', formalUnitNumber: 3, achievementEligible: true, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Unit03.id },
                { id: 'review-01', title: englishTerm2Review01.title, status: 'active', type: 'review', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Review01.id },
                { id: 'unit-04', title: englishTerm2Unit04.title, status: 'active', type: 'unit', formalUnitNumber: 4, achievementEligible: true, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Unit04.id },
                { id: 'unit-05', title: englishTerm2Unit05.title, status: 'active', type: 'unit', formalUnitNumber: 5, achievementEligible: true, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Unit05.id },
                { id: 'unit-06', title: englishTerm2Unit06.title, status: 'active', type: 'unit', formalUnitNumber: 6, achievementEligible: true, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Unit06.id },
                { id: 'review-02', title: englishTerm2Review02.title, status: 'active', type: 'review', formalUnitNumber: null, achievementEligible: false, textbookEditionId: 'grade-2/term-2/english', curriculumUnitKey: englishTerm2Review02.id },
              ],
            },
          ],
        },
      ],
    },
    buildAddedGrade(3),
  ],
  units: {
    ...Object.fromEntries(addedCourseCatalog.map((entry) => [entry.id, getAddedCourseUnit(entry.id)])),
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
    'grade-2/term-1/english/unit-01': englishTerm1Unit01,
    'grade-2/term-1/english/unit-02': englishTerm1Unit02,
    'grade-2/term-1/english/unit-03': englishTerm1Unit03,
    'grade-2/term-1/english/review-01': englishTerm1Review01,
    'grade-2/term-1/english/unit-04': englishTerm1Unit04,
    'grade-2/term-1/english/unit-05': englishTerm1Unit05,
    'grade-2/term-1/english/unit-06': englishTerm1Unit06,
    'grade-2/term-1/english/review-02': englishTerm1Review02,
    'grade-2/term-2/english/unit-01': englishTerm2Unit01,
    'grade-2/term-2/english/unit-02': englishTerm2Unit02,
    'grade-2/term-2/english/unit-03': englishTerm2Unit03,
    'grade-2/term-2/english/review-01': englishTerm2Review01,
    'grade-2/term-2/english/unit-04': englishTerm2Unit04,
    'grade-2/term-2/english/unit-05': englishTerm2Unit05,
    'grade-2/term-2/english/unit-06': englishTerm2Unit06,
    'grade-2/term-2/english/review-02': englishTerm2Review02,
  },
};
