import { Button, Card } from 'animal-island-ui';
import { getSessionPath } from '../../app/router';
import { getSessionsForDifficulty } from '../../content/sessionUtils';
import type { CurriculumUnit } from '../../content/types';
import CompanionAvatar, { COMPANION_PROFILES } from '../mascots/CompanionAvatar';
import HeroGuide from '../mascots/HeroGuide';
import CourseBreadcrumbs from './CourseBreadcrumbs';

interface UnitOverviewProps {
  unitKey: string;
  unit: CurriculumUnit;
  completedSessionIds: string[];
  onNavigate: (path: string) => void;
}

export default function UnitOverview({ unitKey, unit, completedSessionIds, onNavigate }: UnitOverviewProps) {
  const basicSessions = getSessionsForDifficulty(unit, 'basic');
  const completedCount = basicSessions.filter((session) => completedSessionIds.includes(session.id)).length;
  const subjectTitle = unit.subject === 'chinese' ? '语文' : unit.subject === 'math' ? '数学' : '英语';
  const unitNumber = unit.id.slice(-2);
  const guideId = basicSessions[0]?.companionId;

  return (
    <main className="unit-page">
      <div className="catalog-shell">
        <CourseBreadcrumbs
          items={[
            { label: '课程目录', path: '/' },
            { label: '二年级' },
            { label: '上学期' },
            { label: subjectTitle },
            { label: unit.title },
          ]}
          onNavigate={onNavigate}
        />
        <header className="unit-hero">
          <div>
            <p className="eyebrow">二年级 · 上学期 · {subjectTitle} · UNIT {unitNumber}</p>
            <h1>{unit.title}</h1>
            <p className="catalog-lead">挑一场小任务，边玩边把知识装进自己的能量包。</p>
            <div className="catalog-meta">
              <span>{basicSessions.length}场游戏</span>
              <span>每场建议20分钟</span>
              <span>已完成 {completedCount}/{basicSessions.length}</span>
            </div>
          </div>
          <div className="unit-hero-aside">
            {guideId && <HeroGuide mood="welcome" subject={unit.subject} companionId={guideId} compact />}
            <div className="unit-progress-orbit" aria-label={`已完成${completedCount}场，共${basicSessions.length}场`}>
              <span className="unit-progress-total">/ {basicSessions.length}</span>
              <strong>{completedCount}</strong>
              <small>已完成</small>
            </div>
          </div>
        </header>
        <section className="unit-content-section" aria-labelledby="unit-source-heading">
          <Card className="source-card" color="app-yellow">
            <p className="eyebrow">本单元学习地图</p>
            <h2 id="unit-source-heading">我们会遇见这些知识</h2>
            <ul className="source-topic-list">
              {unit.sourceTopics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </Card>
          <div className="session-list-heading">
            <div>
              <p className="eyebrow">选择任务</p>
              <h2>准备好就出发</h2>
            </div>
            <Button type="default" onClick={() => onNavigate('/')}>返回课程目录</Button>
          </div>
          <div className="session-grid">
            {basicSessions.map((session, index) => {
              const complete = completedSessionIds.includes(session.id);
              const companion = COMPANION_PROFILES[session.companionId];
              return (
                <Card key={session.id} className="session-card" color={index % 2 === 0 ? 'app-green' : 'app-blue'}>
                  <div className="session-card-number">任务 {String(index + 1).padStart(2, '0')}</div>
                  <div className="session-card-guide">
                    <CompanionAvatar id={session.companionId} size="small" />
                    <span>{companion.name}陪你完成本场</span>
                  </div>
                  <h3>{session.title}</h3>
                  <p>{session.objective}</p>
                  <div className="session-card-meta">
                    <span>建议 {session.durationMinutes} 分钟</span>
                    <span>{session.activities.length} 个挑战</span>
                  </div>
                  <Button type="primary" block onClick={() => onNavigate(getSessionPath(unitKey, index + 1))}>
                    {complete ? '再玩一次' : '开始游戏'} <span aria-hidden="true">→</span>
                  </Button>
                  {complete && <span className="session-complete-label">已完成 ✦</span>}
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
