import { useRef, useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import type { LearningSession, SubjectId } from '../../content/types';
import HeroGuide from '../mascots/HeroGuide';
import ActivityRenderer from './ActivityRenderer';
import SessionSummary from './SessionSummary';

interface SessionPlayerProps {
  session: LearningSession;
  subject: SubjectId;
  onComplete: (sessionId: string) => void;
  onExit: () => void;
}

export default function SessionPlayer({ session, subject, onComplete, onExit }: SessionPlayerProps) {
  const [activityIndex, setActivityIndex] = useState(0);
  const [solvedActivityIds, setSolvedActivityIds] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const nextLock = useRef(false);
  const activity = session.activities[activityIndex];
  const solved = solvedActivityIds.includes(activity.id);
  const isLast = activityIndex === session.activities.length - 1;
  const progress = (solvedActivityIds.length / session.activities.length) * 100;

  function handleSolved(activityId: string) {
    setSolvedActivityIds((current) => current.includes(activityId) ? current : [...current, activityId]);
  }

  function continueSession() {
    if (!solved || nextLock.current) return;
    nextLock.current = true;
    if (isLast) {
      setShowSummary(true);
      onComplete(session.id);
      return;
    }
    setActivityIndex((current) => current + 1);
    window.setTimeout(() => { nextLock.current = false; }, 0);
  }

  if (showSummary) {
    return (
      <SessionSummary
        session={session}
        subject={subject}
        onExit={onExit}
        onReplay={() => {
          setActivityIndex(0);
          setSolvedActivityIds([]);
          setShowSummary(false);
          nextLock.current = false;
        }}
      />
    );
  }

  return (
    <main className="game-page">
      <div className="game-shell">
        <header className="game-topbar">
          <Button type="default" onClick={onExit}>← 返回单元</Button>
          <span className="game-duration">建议用时 {session.durationMinutes} 分钟</span>
        </header>
        <Card className="session-intro-card" color="app-blue">
          <div className="session-intro-content">
            <p className="eyebrow">学习任务</p>
            <h1>{session.title}</h1>
            <p>{session.objective}</p>
          </div>
          <span className="session-intro-star" aria-hidden="true">✦</span>
        </Card>
        <HeroGuide mood="hint" subject={subject} companionId={session.companionId} compact />
        <section className="game-progress-section" aria-label="挑战进度">
          <div className="game-progress-labels">
            <span>挑战 {activityIndex + 1} / {session.activities.length}</span>
            <span>{solvedActivityIds.length} 个挑战已完成</span>
          </div>
          <div className="game-progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="本场完成进度">
            <span style={{ width: `${progress}%` }} />
          </div>
        </section>
        <Card className="activity-card" color="default">
          <div className="activity-card-heading">
            <span className="activity-number">挑战 {String(activityIndex + 1).padStart(2, '0')}</span>
            <span className="activity-kind-label">{activity.kind === 'choice' ? '选择' : activity.kind === 'match' ? '配对' : activity.kind === 'order' ? '排序' : activity.kind === 'categorize' ? '分类' : activity.kind === 'measurement' ? '测量' : '计算'}</span>
          </div>
          <ActivityRenderer key={activity.id} activity={activity} onSolved={handleSolved} />
        </Card>
        <div className="game-navigation-row">
          <p aria-live="polite">{solved ? '这道挑战完成啦，可以继续。' : '答对后就能进入下一道挑战。'}</p>
          <Button type="primary" disabled={!solved} onClick={continueSession}>
            {isLast ? '完成本场' : '继续下一题'} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
