import { useId, useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import { ArrowRightIcon, CheckCircleIcon, ChevronDownIcon } from 'naive-icons';
import { getSessionPath, getSubjectTitle, getTaskPath, getUnitPath } from '../../app/router';
import { curriculumManifest } from '../../content/curriculumManifest';
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

function getTaskReviewPoints(task: LearningTask): string[] {
  const points = task.sessions.flatMap((session) => session.activities.map((activity) => (
    activity.explanation.trim().replace(/\s+/g, ' ')
  ))).filter(Boolean);
  return [...new Set(points)].slice(0, 4);
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
  const taskReviewPoints = selectedTask ? getTaskReviewPoints(selectedTask) : [];
  const disclosureId = useId();
  const [sourceDisclosureOpen, setSourceDisclosureOpen] = useState(false);
  const [knowledgeMapOpen, setKnowledgeMapOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [expandedSessionIds, setExpandedSessionIds] = useState<string[]>([]);
  const gradeAndTerm = getPositionLabels(unitKey);
  const difficulties: Difficulty[] = selectedDifficulty ? [selectedDifficulty] : ['basic', 'advanced', 'high'];
  const textbook = curriculumManifest.textbooks[unit.textbookEditionId];
  const sourceDisclosure = textbook?.sourceKind === 'tapx-fallback'
    ? '家长提示：本课程依据 TapXWorld 固定快照中的教材内容设计，可能与人教社后续修订版存在差异。'
    : textbook?.sourceKind === 'pep-latest'
      ? '家长提示：本课程依据人教社公开最新版教材内容设计。'
      : '家长提示：本课程教材来源正在核对中。';
  const firstBasicTask = allBasicSessions.length > 0 ? unit.difficultyTracks.basic.tasks[0] : undefined;
  const nextSessionIndex = selectedTask
    ? Math.max(0, selectedTask.sessions.findIndex((session) => !completedSessionIds.includes(session.id)))
    : -1;
  const dockSession = selectedTask?.sessions[nextSessionIndex];
  const allTaskSessionsComplete = Boolean(selectedTask)
    && selectedTask!.sessions.every((session) => completedSessionIds.includes(session.id));
  const sourceDisclosureId = `${disclosureId}-source`;
  const knowledgeMapId = `${disclosureId}-map`;
  const reviewId = `${disclosureId}-review`;

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
        <header className={'unit-hero' + (selectedTask ? ' unit-hero--task' : '')}>
          <div>
            <p className="eyebrow">
              {gradeAndTerm.grade} · {gradeAndTerm.term} · {subjectTitle} · UNIT {unitNumber}
              {selectedTask && <span> · {DIFFICULTY_LABELS[selectedDifficulty!]}任务</span>}
            </p>
            <h1>{selectedTask?.title ?? unit.title}</h1>
            <p className="catalog-lead">{selectedTask ? selectedTask.objective : '挑一项适合自己的任务，边玩边把知识装进能量包。'}</p>
            <div className="catalog-meta">
              <span>{visibleSessions.length} 场游戏</span>
              <span>每场建议 20 分钟</span>
              <span>已完成 {completedCount}/{visibleSessions.length}</span>
            </div>
            <div className="catalog-source-disclosure-wrap">
              <Button
                type="text"
                className="catalog-source-disclosure-toggle"
                aria-expanded={sourceDisclosureOpen}
                aria-controls={sourceDisclosureId}
                onClick={() => setSourceDisclosureOpen((open) => !open)}
              >
                <span className="button-label-with-icon">教材来源说明 <ChevronDownIcon size={16} aria-hidden="true" /></span>
              </Button>
              <p id={sourceDisclosureId} className="catalog-source-disclosure" role="note" hidden={!sourceDisclosureOpen}>{sourceDisclosure}</p>
            </div>
          </div>
          <div className="unit-hero-aside">
            {firstSession && <HeroGuide mood="welcome" subject={unit.subject} companionId={firstSession.companionId} compact />}
            <div
              className="unit-progress-orbit"
              role="progressbar"
              aria-label={`场次完成进度，已完成${completedCount}场，共${visibleSessions.length}场`}
              aria-valuemin={0}
              aria-valuemax={Math.max(1, visibleSessions.length)}
              aria-valuenow={completedCount}
            >
              <span className="unit-progress-total">/ {visibleSessions.length}</span>
              <strong>{completedCount}</strong>
              <small>已完成</small>
            </div>
          </div>
        </header>

        {!selectedTask ? (
          <section className="unit-content-section" aria-labelledby="unit-source-heading">
            <Card className="source-card source-card--compact" color="default">
              <p className="eyebrow">本单元学习地图</p>
              <Button
                type="text"
                className="content-disclosure-toggle"
                aria-expanded={knowledgeMapOpen}
                aria-controls={knowledgeMapId}
                onClick={() => setKnowledgeMapOpen((open) => !open)}
              >
                <span className="button-label-with-icon">
                  <span id="unit-source-heading">查看本单元知识地图 · {unit.sourceTopics.length} 个知识点</span>
                  <ChevronDownIcon size={18} aria-hidden="true" />
                </span>
              </Button>
              <div id={knowledgeMapId} hidden={!knowledgeMapOpen}>
                <h2 className="visually-hidden">我们会遇见这些知识</h2>
                <ul className="source-topic-list">
                  {unit.sourceTopics.map((topic) => <li key={topic}>{topic}</li>)}
                </ul>
              </div>
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
                      <div className={`task-grid ${track.tasks.length === 1 ? 'is-single' : ''}`}>
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
                              <Button type="primary" block icon={<ArrowRightIcon size={18} aria-hidden="true" />} onClick={() => onNavigate(getTaskPath(unitKey, difficulty, task.id))}>
                                查看任务
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
            <div className={`session-grid ${selectedTask.sessions.length === 1 ? 'is-single' : ''}`}>
              {selectedTask.sessions.map((session, index) => {
                const complete = completedSessionIds.includes(session.id);
                const companion = COMPANION_PROFILES[session.companionId];
                return (
                  <Card key={session.id} className="session-card" color="default">
                    <div className="session-card-number">第 {index + 1} 场</div>
                    <div className="session-card-guide">
                      <CompanionAvatar id={session.companionId} size="small" />
                      <span>{companion.name}陪你完成本场</span>
                    </div>
                    <h3>{session.title}</h3>
                    <Button
                      type="text"
                      className="session-objective-toggle"
                      aria-expanded={expandedSessionIds.includes(session.id)}
                      aria-controls={`${disclosureId}-objective-${index}`}
                      onClick={() => setExpandedSessionIds((current) => current.includes(session.id)
                        ? current.filter((sessionId) => sessionId !== session.id)
                        : [...current, session.id])}
                    >
                      <span className="button-label-with-icon">本场学习目标 <ChevronDownIcon size={15} aria-hidden="true" /></span>
                    </Button>
                    <p id={`${disclosureId}-objective-${index}`} className="session-card-objective" hidden={!expandedSessionIds.includes(session.id)}>{session.objective}</p>
                    <div className="session-card-meta">
                      <span>建议 {session.durationMinutes} 分钟</span>
                      <span>{session.activities.length} 个挑战</span>
                    </div>
                    <Button
                      type="primary"
                      block
                      icon={<ArrowRightIcon size={18} aria-hidden="true" />}
                      onClick={() => onNavigate(getSessionPath(unitKey, selectedDifficulty!, selectedTask.id, session.id))}
                    >
                      {complete ? '再玩一次' : `开始第 ${index + 1} 场`}
                    </Button>
                    {complete && <span className="session-complete-label"><CheckCircleIcon size={16} aria-hidden="true" /> 已完成</span>}
                  </Card>
                );
              })}
            </div>
            {taskReviewPoints.length > 0 ? (
              <section className="task-knowledge-review">
                <Button
                  type="default"
                  className="content-disclosure-toggle task-review-toggle"
                  aria-expanded={reviewOpen}
                  aria-controls={reviewId}
                  onClick={() => setReviewOpen((open) => !open)}
                >
                  <span className="button-label-with-icon">出发前复习知识点 · {taskReviewPoints.length} 条 <ChevronDownIcon size={18} aria-hidden="true" /></span>
                </Button>
                <div id={reviewId} className="task-review-content" role="region" aria-labelledby="task-knowledge-review-heading" hidden={!reviewOpen}>
                  <Card className="source-card task-review-card" color="default">
                    <p className="eyebrow">出发前 30 秒</p>
                    <h2 id="task-knowledge-review-heading">本任务知识点回顾</h2>
                    <p className="task-review-intro">看看这些小发现，带着线索开始挑战吧。</p>
                    <ol className="task-review-list">
                      {taskReviewPoints.map((point, index) => (
                        <li key={`${index}-${point}`}>
                          <span aria-hidden="true">{index + 1}</span>
                          <p>{point}</p>
                        </li>
                      ))}
                    </ol>
                  </Card>
                </div>
              </section>
            ) : null}
          </section>
        )}
        {selectedTask && dockSession ? (
          <aside className="mobile-study-dock" aria-label="继续学习">
            <p>{allTaskSessionsComplete ? '本任务已经完成' : `已完成 ${completedCount}/${visibleSessions.length} 场`}</p>
            <Button
              type="primary"
              icon={<ArrowRightIcon size={18} aria-hidden="true" />}
              onClick={() => onNavigate(getSessionPath(unitKey, selectedDifficulty!, selectedTask.id, dockSession.id))}
            >
              {allTaskSessionsComplete ? `复习第 ${nextSessionIndex + 1} 场` : `继续学习第 ${nextSessionIndex + 1} 场`}
            </Button>
          </aside>
        ) : firstBasicTask ? (
          <aside className="mobile-study-dock" aria-label="继续学习">
            <p>从基础任务开始，稳稳点亮知识</p>
            <Button
              type="primary"
              icon={<ArrowRightIcon size={18} aria-hidden="true" />}
              onClick={() => onNavigate(getTaskPath(unitKey, 'basic', firstBasicTask.id))}
            >
              开始基础任务
            </Button>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
