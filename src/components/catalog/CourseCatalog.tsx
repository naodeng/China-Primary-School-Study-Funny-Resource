import { useRef, useState } from 'react';
import { Button, Card, Select } from 'animal-island-ui';
import { ArrowRightIcon, SettingsIcon, StarIcon } from 'naive-icons';
import { curriculumManifest } from '../../content/curriculumManifest';
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
  const initialGrade = curriculumManifest.grades.find((entry) => entry.id === `grade-${progress.learningStart?.grade}`) ?? curriculumManifest.grades[0];
  const initialTerm = initialGrade?.terms.find((entry) => entry.id === `term-${progress.learningStart?.term}`) ?? initialGrade?.terms[0];
  const [subjectId, setSubjectId] = useState<SubjectId>('chinese');
  const [gradeId, setGradeId] = useState(initialGrade?.id ?? 'grade-2');
  const [termId, setTermId] = useState(initialTerm?.id ?? 'term-1');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const courseSelectionRef = useRef<HTMLDivElement>(null);
  const grade = curriculumManifest.grades.find((entry) => entry.id === gradeId) ?? curriculumManifest.grades[0];
  const term = grade?.terms.find((entry) => entry.id === termId) ?? grade?.terms[0];
  const subject = term?.subjects.find((entry) => entry.id === subjectId) ?? term?.subjects[0];
  const subjectTextbook = subject?.units[0]
    ? curriculumManifest.textbooks[subject.units[0].textbookEditionId]
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

  function applyLearningStart(position: LearningPosition) {
    const nextGrade = curriculumManifest.grades.find((entry) => entry.id === `grade-${position.grade}`);
    const nextTerm = nextGrade?.terms.find((entry) => entry.id === `term-${position.term}`);
    if (nextGrade && nextTerm) {
      setGradeId(nextGrade.id);
      setTermId(nextTerm.id);
      setSubjectId(nextTerm.subjects.find((entry) => entry.id === 'chinese')?.id ?? nextTerm.subjects[0]?.id ?? 'chinese');
    }
    onApplyLearningStart(position);
  }

  function focusCourseSelection() {
    const target = courseSelectionRef.current;
    if (!target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
  }

  return (
    <main className="catalog-page">
      <div className="catalog-shell">
        <div className="catalog-topbar">
          <CourseBreadcrumbs items={[{ label: '课程目录' }]} onNavigate={onNavigate} />
          <Button type="default" className="catalog-settings-button" icon={<SettingsIcon size={18} aria-hidden="true" />} onClick={() => setSettingsOpen(true)}>
            设置
          </Button>
        </div>
        <header className="catalog-hero">
          <div className="catalog-hero-copy">
            <div className="catalog-brand-lockup">
              <h1 className="catalog-brand-heading">
                <img
                  className="catalog-brand-logo"
                  src="/assets/brand/starry-island-logo-512.png"
                  alt="星岛学园 · Starry Island"
                  width="512"
                  height="512"
                  fetchPriority="high"
                />
              </h1>
              <div className="catalog-hero-message">
                <div className="catalog-current-route">
                  <span className="catalog-current-route-symbol" aria-hidden="true"><StarIcon size={17} /></span>
                  <div className="catalog-current-route-copy">
                    <span className="catalog-current-route-label">当前探索航线</span>
                    <div className="catalog-current-route-values" aria-live="polite" aria-atomic="true">
                      <strong>{grade.title}</strong>
                      <span className="catalog-route-term">{term.title}</span>
                      <span className="catalog-route-subject">{subject.title}</span>
                      <span className="catalog-route-edition">人教版</span>
                    </div>
                  </div>
                  <Button
                    type="default"
                    className="catalog-current-route-action"
                    aria-label={`调整课程选择，当前为${grade.title}${term.title}${subject.title}人教版`}
                    onClick={focusCourseSelection}
                  >
                    <span className="button-label-with-icon"><span className="catalog-current-route-action-label">调整</span><ArrowRightIcon size={15} aria-hidden="true" /></span>
                  </Button>
                </div>
                <p className="catalog-lead">快乐学习，点亮每一颗知识星球。选好课程，和伙伴一起出发！</p>
                <div className="catalog-meta" aria-label="课程信息">
                  <span>每场约20分钟</span>
                  <span>随时开始</span>
                  <span>进度保存在本机</span>
                </div>
              </div>
            </div>
          </div>
          <aside className="catalog-hero-crew" aria-label="学习伙伴小队">
            <p className="catalog-hero-crew-heading">星岛伙伴 · 一起探索</p>
            <div className="companion-roster" aria-label="四位学习伙伴">
              {COMPANION_IDS.map((id) => (
                <div className="companion-roster-member" key={id}>
                  <CompanionAvatar id={id} size="small" />
                  <span>{COMPANION_PROFILES[id].name}</span>
                </div>
              ))}
            </div>
            <HeroGuide mood="welcome" subject={subject.id} companionId={guideId} compact />
            <AchievementSummary
              compact
              completedSessionIds={progress.completedSessionIds}
              learningStart={progress.learningStart}
              onNavigate={onNavigate}
            />
          </aside>
        </header>

        <section className="catalog-section" aria-labelledby="subject-heading">
          <div className="catalog-section-heading">
            <div>
              <p className="eyebrow">学习地图</p>
              <h2 id="subject-heading">今天想探索哪座星球</h2>
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
          <div
            ref={courseSelectionRef}
            id="catalog-course-selection"
            className="catalog-grade-label"
            role="group"
            aria-label="选择学习年级和学期"
            tabIndex={-1}
          >
            <label className="catalog-selector">
              <span>年级</span>
              <Select
                aria-label="年级"
                options={curriculumManifest.grades.map((entry) => ({ key: entry.id, label: entry.title }))}
                value={grade.id}
                onChange={(value) => {
                  const nextGrade = curriculumManifest.grades.find((entry) => entry.id === value);
                  if (!nextGrade) return;
                  setGradeId(nextGrade.id);
                  setTermId(nextGrade.terms[0]?.id ?? 'term-1');
                  setSubjectId(nextGrade.terms[0]?.subjects[0]?.id ?? 'chinese');
                }}
              />
            </label>
            <label className="catalog-selector">
              <span>学期</span>
              <Select
                aria-label="学期"
                options={grade.terms.map((entry) => ({ key: entry.id, label: entry.title }))}
                value={term.id}
                onChange={(value) => {
                  const nextTerm = grade.terms.find((entry) => entry.id === value);
                  if (!nextTerm) return;
                  setTermId(nextTerm.id);
                  setSubjectId(nextTerm.subjects[0]?.id ?? 'chinese');
                }}
              />
            </label>
          </div>
          {subject.id === 'english' && subjectTextbook?.schoolOfferingStatus === 'unconfirmed' ? (
            <p className="catalog-source-disclosure" role="note">
              英语预备级是否属于学校本学期实际开设课程，请以学校安排为准。
            </p>
          ) : null}
          <div className="unit-grid">
            {subject.units.map((unit) => {
              const active = unit.status === 'active'
                && curriculumManifest.textbooks[unit.textbookEditionId]?.verificationStatus === 'verified';
              return (
                <Card
                  key={unit.id}
                  className={`unit-card ${active ? 'unit-card-active' : 'unit-card-soon'}`}
                  color="default"
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
                      <Button type="primary" block icon={<ArrowRightIcon size={18} aria-hidden="true" />} onClick={() => openUnit(unit)}>进入单元</Button>
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
        <footer className="catalog-footer">
          <span>学习靠好奇心，每次完成一点点就很棒。</span>
          <span className="footer-orbit" aria-hidden="true"><StarIcon size={22} /></span>
        </footer>
      </div>
      <SettingsDialog
        open={settingsOpen}
        progress={progress}
        onClose={() => setSettingsOpen(false)}
        onApplyLearningStart={applyLearningStart}
        onNavigate={(path) => {
          setSettingsOpen(false);
          onNavigate(path);
        }}
      />
    </main>
  );
}
