import { Button, Card } from 'animal-island-ui';
import { getSessionPath, getSubjectTitle, getTaskPath, getUnitPath } from '../../app/router';
import type { CurriculumUnit, Difficulty, LearningTask } from '../../content/types';
import { getSessionsForDifficulty } from '../../content/sessionUtils';
import CompanionAvatar, { COMPANION_PROFILES } from '../mascots/CompanionAvatar';
import HeroGuide from '../mascots/HeroGuide';
import CourseBreadcrumbs from './CourseBreadcrumbs';

interface UnitOverviewProps {
  unitKey: string;
  unit: CurriculumUnit;
  completedSessionIds: string[];
  onNavigate: (path: string) => void;
  selectedDifficulty?: Difficulty;
  selectedTask?: LearningTask;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  basic: '基础版',
  advanced: '进阶版',
  high: '高阶版',
};

const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  basic: '跟着知识点一步一步练习，打好基础。',
  advanced: '试着把几个知识点连起来解决问题。',
  high: '挑战更灵活的任务，发现更多解题办法。',
};

function getPositionLabels(unitKey: string): { grade: string; term: string } {
  const [gradeId, termId] = unitKey.split('/');
  return {
    grade: `${Number(gradeId?.replace('grade-', '')) || ''}年级`,
    term: termId === 'term-1' ? '上学期' : '下学期',
  };
}

export default function UnitOverview({
  unitKey,
  unit,
  completedSessionIds,
  onNavigate,
  selectedDifficulty,
  selectedTask,
}: UnitOverviewProps) {
  const allBasicSessions = getSessionsForDifficulty(unit, 'basic');
  const visibleSessions = selectedTask?.sessions ?? allBasicSessions;
  const completedCount = visibleSessions.filter((session) => completedSessionIds.includes(session.id)).length;
  const subjectTitle = getSubjectTitle(unit.subject);
  const unitNumber = unit.formalUnitNumber ?? unit.id.slice(-2);
  const firstSession = selectedTask?.sessions[0] ?? allBasicSessions[0];
  const gradeAndTerm = getPositionLabels(unitKey);
  const difficulties: Difficulty[] = selectedDifficulty ? [selectedDifficulty] : ['basic', 'advanced', 'high'];

  const breadcrumbItems = [
    { label: '课程目录', path: '/' },
    { label: gradeAndTerm.grade },
    { label: gradeAndTerm.term },
    { label: subjectTitle },
    { label: unit.title, path: selectedTask ? getUnitPath(unitKey) : undefined },
    ...(selectedTask ? [{ label: `${DIFFICULTY_LABELS[selectedDifficulty!] } · ${selectedTask.title}` }] : []),
  ];

  return (
    <main className="unit-page">
      <div className="catalog-shell">
        <CourseBreadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
        <header className="unit-hero">
          <div>
            <p className="eyebrow">{gradeAndTerm.grade} · {gradeAndTerm.term} · {subjectTitle} · UNIT {unitNumber}</p>
            <h1>{unit.title}</h1>
            <p className="catalog-lead">{selectedTask ? selectedTask.objective : '挑一项适合自己的任务，边玩边把知识装进能量包。'}</p>
            <div className="catalog-meta">
              <span>{visibleSessions.length} 场游戏</span>
              <span>每场建议 20 分钟</span>
              <span>已完成 {completedCount}/{visibleSessions.length}</span>
            </div>
          </div>
          <div className="unit-hero-aside">
            {firstSession && <HeroGuide mood="welcome" subject={unit.subject} companionId={firstSession.companionId} compact />}
            <div className="unit-progress-orbit" aria-label={`已完成${completedCount}场，共${visibleSessions.length}场`}>
              <span className="unit-progress-total">/ {visibleSessions.length}</span>
              <strong>{completedCount}</strong>
              <small>已完成</small>
            </div>
          </div>
        </header>

        {!selectedTask ? (
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

            <div className="difficulty-track-list">
              {difficulties.map((difficulty) => {
                const track = unit.difficultyTracks[difficulty];
                return (
                  <section className={`difficulty-track difficulty-track--${difficulty}`} key={difficulty} aria-labelledby={`difficulty-${difficulty}`}>
                    <header className="difficulty-track-heading">
                      <div>
                        <p className="eyebrow">{difficulty === 'basic' ? '一步步练习' : difficulty === 'advanced' ? '连接知识' : '勇敢挑战'}</p>
                        <h2 id={`difficulty-${difficulty}`}>{DIFFICULTY_LABELS[difficulty]}任务</h2>
                        <p>{DIFFICULTY_DESCRIPTIONS[difficulty]}</p>
                      </div>
                      <span className="difficulty-task-count">{track.tasks.length} 个任务</span>
                    </header>
                    {track.tasks.length ? (
                      <div className="task-grid">
                        {track.tasks.map((task) => {
                          const doneCount = task.sessions.filter((session) => completedSessionIds.includes(session.id)).length;
                          return (
                            <Card className="task-card" key={task.id} color="default">
                              <div className="session-card-number">任务 {String(task.order).padStart(2, '0')}</div>
                              <h3>{task.title}</h3>
                              <p>{task.objective}</p>
                              <div className="session-card-meta">
                                <span>{task.sessions.length} 场游戏</span>
                                <span>已完成 {doneCount}/{task.sessions.length} 场</span>
                              </div>
                              <Button type="primary" block onClick={() => onNavigate(getTaskPath(unitKey, difficulty, task.id))}>
                                查看任务 <span aria-hidden="true">→</span>
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="task-track-empty">这档任务正在准备中，核对好教材内容后就会开放。</p>
                    )}
                  </section>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="unit-content-section" aria-labelledby="task-sessions-heading">
            <div className="session-list-heading">
              <div>
                <p className="eyebrow">{DIFFICULTY_LABELS[selectedDifficulty!] } · {selectedTask.title}</p>
                <h2 id="task-sessions-heading">学习场次</h2>
              </div>
              <Button type="default" onClick={() => onNavigate(getUnitPath(unitKey))}>返回单元任务</Button>
            </div>
            <div className="session-grid">
              {selectedTask.sessions.map((session, index) => {
                const complete = completedSessionIds.includes(session.id);
                const companion = COMPANION_PROFILES[session.companionId];
                return (
                  <Card key={session.id} className="session-card" color={index % 2 === 0 ? 'app-green' : 'app-blue'}>
                    <div className="session-card-number">第 {index + 1} 场</div>
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
                    <Button
                      type="primary"
                      block
                      onClick={() => onNavigate(getSessionPath(unitKey, selectedDifficulty!, selectedTask.id, session.id))}
                    >
                      {complete ? '再玩一次' : `开始第 ${index + 1} 场`} <span aria-hidden="true">→</span>
                    </Button>
                    {complete && <span className="session-complete-label">已完成 ✦</span>}
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
