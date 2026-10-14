import { useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import { curriculum } from '../../content/curriculum';
import type { CatalogUnitEntry, SubjectId } from '../../content/types';
import type { LearningPosition } from '../../achievements/position';
import type { ProgressState } from '../../storage/progress';
import { getUnitPath } from '../../app/router';
import { COMPANION_IDS, COMPANION_PROFILES } from '../mascots/CompanionAvatar';
import CompanionAvatar from '../mascots/CompanionAvatar';
import HeroGuide from '../mascots/HeroGuide';
import AchievementSummary from '../achievements/AchievementSummary';
import SettingsDialog from '../settings/SettingsDialog';
import CourseBreadcrumbs from './CourseBreadcrumbs';

interface CourseCatalogProps {
  progress: ProgressState;
  onNavigate: (path: string) => void;
  onApplyLearningStart: (position: LearningPosition) => void;
}

export default function CourseCatalog({ progress, onNavigate, onApplyLearningStart }: CourseCatalogProps) {
  const [subjectId, setSubjectId] = useState<SubjectId>('chinese');
  const [gradeId, setGradeId] = useState(curriculum.grades[0]?.id ?? 'grade-2');
  const [termId, setTermId] = useState(curriculum.grades[0]?.terms[0]?.id ?? 'term-1');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const grade = curriculum.grades.find((entry) => entry.id === gradeId) ?? curriculum.grades[0];
  const term = grade?.terms.find((entry) => entry.id === termId) ?? grade?.terms[0];
  const subject = term?.subjects.find((entry) => entry.id === subjectId) ?? term?.subjects[0];
  const subjectTextbook = subject?.units[0]
    ? curriculum.textbooks[subject.units[0].textbookEditionId]
    : undefined;
  const guideId = subject?.id === 'chinese' ? 'companion-02' : subject?.id === 'english' ? 'companion-03' : 'companion-01';

  if (!grade || !term || !subject) {
    return (
      <main className="catalog-page">
        <div className="catalog-shell">
          <h1>课程目录正在准备中</h1>
          <p>核对好教材和课程后，这里就会出现新的学习路线。</p>
        </div>
      </main>
    );
  }

  function openUnit(unit: CatalogUnitEntry) {
    if (unit.status === 'active') onNavigate(getUnitPath(unit.curriculumUnitKey!));
  }

  return (
    <main className="catalog-page">
      <div className="catalog-shell">
        <div className="catalog-topbar">
          <CourseBreadcrumbs items={[{ label: '课程目录' }]} onNavigate={onNavigate} />
          <Button type="default" className="catalog-settings-button" onClick={() => setSettingsOpen(true)}>
            <span aria-hidden="true">⚙</span> 设置
          </Button>
        </div>
        <header className="catalog-hero">
          <div className="catalog-hero-copy">
            <p className="eyebrow">{grade.title} · {term.title} · 人教版</p>
            <h1>星岛学习站</h1>
            <p className="catalog-lead">先选年级、学期和学科，再沿着自己的学习路线探索。每一次认真尝试，都会让你离新发现更近一步。</p>
            <div className="catalog-meta" aria-label="课程信息">
              <span>每场约20分钟</span>
              <span>随时开始</span>
              <span>进度保存在本机</span>
            </div>
          </div>
          <aside className="catalog-hero-crew" aria-label="学习伙伴小队">
            <HeroGuide mood="welcome" subject={subject.id} companionId={guideId} compact />
            <div className="companion-roster" aria-label="四位学习伙伴">
              {COMPANION_IDS.map((id) => (
                <div className="companion-roster-member" key={id}>
                  <CompanionAvatar id={id} size="small" />
                  <span>{COMPANION_PROFILES[id].name}</span>
                </div>
              ))}
            </div>
          </aside>
        </header>

        <section className="catalog-section" aria-labelledby="subject-heading">
          <div className="catalog-section-heading">
            <div>
              <p className="eyebrow">学习地图</p>
              <h2 id="subject-heading">今天想玩哪门课？</h2>
            </div>
            <div className="subject-switch" role="group" aria-label="选择学科">
              {term.subjects.map((entry) => (
                <Button
                  key={entry.id}
                  type={subject.id === entry.id ? 'primary' : 'default'}
                  aria-pressed={subject.id === entry.id}
                  onClick={() => setSubjectId(entry.id)}
                >
                  {entry.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="catalog-grade-label">
            <label className="catalog-selector">
              <span>年级</span>
              <select
                aria-label="年级"
                value={grade.id}
                onChange={(event) => {
                  const nextGrade = curriculum.grades.find((entry) => entry.id === event.target.value);
                  if (!nextGrade) return;
                  setGradeId(nextGrade.id);
                  setTermId(nextGrade.terms[0]?.id ?? 'term-1');
                  setSubjectId(nextGrade.terms[0]?.subjects[0]?.id ?? 'chinese');
                }}
              >
                {curriculum.grades.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
              </select>
            </label>
            <label className="catalog-selector">
              <span>学期</span>
              <select
                aria-label="学期"
                value={term.id}
                onChange={(event) => {
                  const nextTerm = grade.terms.find((entry) => entry.id === event.target.value);
                  if (!nextTerm) return;
                  setTermId(nextTerm.id);
                  setSubjectId(nextTerm.subjects[0]?.id ?? 'chinese');
                }}
              >
                {grade.terms.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
              </select>
            </label>
            <span className="catalog-subject-name">{subject.title}</span>
          </div>
          {subject.id === 'english' && subjectTextbook?.schoolOfferingStatus === 'unconfirmed' ? (
            <p className="catalog-source-disclosure" role="note">
              英语预备级是否属于学校本学期实际开设课程，请以学校安排为准。
            </p>
          ) : null}
          <div className="unit-grid">
            {subject.units.map((unit, index) => {
              const active = unit.status === 'active'
                && curriculum.textbooks[unit.textbookEditionId]?.verificationStatus === 'verified';
              return (
                <Card
                  key={unit.id}
                  className={`unit-card ${active ? 'unit-card-active' : 'unit-card-soon'}`}
                  color={active ? (index % 2 === 0 ? 'app-green' : 'app-blue') : 'default'}
                  hoverable={active}
                  aria-label={`${unit.title}${active ? '' : '，筹备中'}`}
                >
                  <div className="unit-card-topline">
                    <span className="unit-number">
                      {unit.formalUnitNumber !== null
                        ? `UNIT ${String(unit.formalUnitNumber).padStart(2, '0')}`
                        : unit.type === 'review' ? '复习站' : '实践站'}
                    </span>
                    <span className={`unit-status ${active ? 'is-active' : 'is-soon'}`}>{active ? '可以出发' : '筹备中'}</span>
                  </div>
                  <h3>{unit.title}</h3>
                  {active ? (
                    <>
                      <p>{subject.id === 'chinese' ? '识字、阅读与表达小游戏' : subject.id === 'math' ? '测量、运算与思维小游戏' : '单词、表达与语言小游戏'}</p>
                      <Button type="primary" block onClick={() => openUnit(unit)}>进入单元 <span aria-hidden="true">→</span></Button>
                    </>
                  ) : (
                    <p className="coming-soon-copy">这座学习小岛正在准备中，过一段时间再来看看吧。</p>
                  )}
                </Card>
              );
            })}
          </div>
          {!subject.units.length ? <p className="catalog-empty-note">这个学期的{subject.title}课程正在核对教材版本，准备好后就会开放。</p> : null}
        </section>
        <AchievementSummary
          completedSessionIds={progress.completedSessionIds}
          learningStart={progress.learningStart}
          onNavigate={onNavigate}
        />
        <footer className="catalog-footer">
          <span>学习靠好奇心，每次完成一点点就很棒。</span>
          <span className="footer-orbit" aria-hidden="true">✧</span>
        </footer>
      </div>
      <SettingsDialog
        open={settingsOpen}
        progress={progress}
        onClose={() => setSettingsOpen(false)}
        onApplyLearningStart={onApplyLearningStart}
        onNavigate={(path) => {
          setSettingsOpen(false);
          onNavigate(path);
        }}
      />
    </main>
  );
}
