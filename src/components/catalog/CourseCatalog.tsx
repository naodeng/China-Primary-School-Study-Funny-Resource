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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const grade = curriculum.grades.find((entry) => entry.id === 'grade-2')!;
  const term = grade.terms.find((entry) => entry.id === 'term-1')!;
  const subject = term.subjects.find((entry) => entry.id === subjectId)!;
  const guideId = subjectId === 'chinese' ? 'companion-02' : 'companion-01';

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
            <p className="eyebrow">二年级 · 上学期 · 人教版</p>
            <h1>星岛学习站</h1>
            <p className="catalog-lead">选一座知识小岛，和伙伴们一起闯关。每一次认真尝试，都会让你离新发现更近一步。</p>
            <div className="catalog-meta" aria-label="课程信息">
              <span>每场约20分钟</span>
              <span>随时开始</span>
              <span>进度保存在本机</span>
            </div>
          </div>
          <aside className="catalog-hero-crew" aria-label="学习伙伴小队">
            <HeroGuide mood="welcome" subject={subjectId} companionId={guideId} compact />
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
              <Button type={subjectId === 'chinese' ? 'primary' : 'default'} aria-pressed={subjectId === 'chinese'} onClick={() => setSubjectId('chinese')}>语文</Button>
              <Button type={subjectId === 'math' ? 'primary' : 'default'} aria-pressed={subjectId === 'math'} onClick={() => setSubjectId('math')}>数学</Button>
            </div>
          </div>
          <div className="catalog-grade-label">
            <span className="grade-badge">{grade.title}</span>
            <span>{term.title}</span>
            <span className="catalog-subject-name">{subject.title}</span>
          </div>
          <div className="unit-grid">
            {subject.units.map((unit, index) => {
              const active = unit.status === 'active';
              return (
                <Card
                  key={unit.id}
                  className={`unit-card ${active ? 'unit-card-active' : 'unit-card-soon'}`}
                  color={active ? (index % 2 === 0 ? 'app-green' : 'app-blue') : 'default'}
                  hoverable={active}
                  aria-label={`${unit.title}${active ? '' : '，筹备中'}`}
                >
                  <div className="unit-card-topline">
                    <span className="unit-number">UNIT {unit.id.slice(-2)}</span>
                    <span className={`unit-status ${active ? 'is-active' : 'is-soon'}`}>{active ? '可以出发' : '筹备中'}</span>
                  </div>
                  <h3>{unit.title}</h3>
                  {active ? (
                    <>
                      <p>{unit.curriculumUnitKey?.includes('/chinese/') ? '识字、阅读与表达小游戏' : '测量、运算与思维小游戏'}</p>
                      <Button type="primary" block onClick={() => openUnit(unit)}>进入单元 <span aria-hidden="true">→</span></Button>
                    </>
                  ) : (
                    <p className="coming-soon-copy">这座学习小岛正在准备中，过一段时间再来看看吧。</p>
                  )}
                </Card>
              );
            })}
          </div>
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
