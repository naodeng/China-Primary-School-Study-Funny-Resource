import { useRef, useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import type { CosmicRank } from '../../achievements/progress';
import type { LearningSession, SubjectId } from '../../content/types';
import { selectFeedbackMessage } from '../../learning/feedback';
import type { FeedbackStatus } from '../../learning/feedback';
import { getAnswerSoundFeedback } from '../../sound/soundCues';
import { useSound } from '../../sound/SoundProvider';
import {
  advanceSession,
  createSessionState,
  getSessionProgress,
  isCurrentActivitySolved,
  markCurrentActivitySolved,
} from '../../learning/session';
import HeroGuide from '../mascots/HeroGuide';
import ActivityRenderer from './ActivityRenderer';
import SessionSummary from './SessionSummary';

interface SessionPlayerProps {
  session: LearningSession;
  subject: SubjectId;
  newlyUnlockedRank: CosmicRank | null;
  onComplete: (sessionId: string) => void;
  onExit: () => void;
}

export default function SessionPlayer({ session, subject, newlyUnlockedRank, onComplete, onExit }: SessionPlayerProps) {
  const { playCue } = useSound();
  const [sessionState, setSessionState] = useState(() => createSessionState(session.activities.map((activity) => activity.id)));
  const nextLock = useRef(false);
  const consecutiveCorrectCount = useRef(0);
  const previousFeedbackMessages = useRef<Record<FeedbackStatus, string | null>>({ correct: null, incorrect: null });
  const activity = session.activities[sessionState.currentIndex];
  const solved = isCurrentActivitySolved(sessionState);
  const progress = getSessionProgress(sessionState);

  function handleSolved(activityId: string) {
    setSessionState((current) => markCurrentActivitySolved(current, activityId));
  }

  function handleAnswerResult(status: FeedbackStatus, activityId: string) {
    const feedback = getAnswerSoundFeedback(
      status,
      consecutiveCorrectCount.current,
      status === 'correct' && activityId === session.activities.at(-1)?.id,
    );
    consecutiveCorrectCount.current = feedback.consecutiveCorrectCount;
    playCue(feedback.cue);
  }

  function getFeedbackMessage(status: FeedbackStatus): string {
    const message = selectFeedbackMessage(status, previousFeedbackMessages.current[status]);
    previousFeedbackMessages.current[status] = message;
    return message;
  }

  function continueSession() {
    if (!solved || nextLock.current || sessionState.completed) return;
    nextLock.current = true;
    const nextState = advanceSession(sessionState);
    if (nextState === sessionState) {
      nextLock.current = false;
      return;
    }
    setSessionState(nextState);
    if (nextState.completed) {
      onComplete(session.id);
      return;
    }
    window.setTimeout(() => { nextLock.current = false; }, 0);
  }

  if (sessionState.completed) {
    return (
      <SessionSummary
        session={session}
        subject={subject}
        newlyUnlockedRank={newlyUnlockedRank}
        onExit={onExit}
        onReplay={() => {
          setSessionState(createSessionState(session.activities.map((item) => item.id)));
          nextLock.current = false;
          consecutiveCorrectCount.current = 0;
        }}
      />
    );
  }

  if (!activity) {
    return (
      <main className="game-page">
        <div className="game-shell">
          <Card className="session-intro-card" color="app-yellow">
            <h1>这场游戏还没有准备好</h1>
            <p>课程伙伴正在整理题目，我们确认好内容后就会邀请你来挑战。</p>
            <Button type="primary" onClick={onExit}>返回课程</Button>
          </Card>
        </div>
      </main>
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
            <span>挑战 {sessionState.currentIndex + 1} / {session.activities.length}</span>
            <span>{sessionState.solvedActivityIds.length} 个挑战已完成</span>
          </div>
          <div className="game-progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="本场完成进度">
            <span style={{ width: `${progress}%` }} />
          </div>
        </section>
        <Card className="activity-card" color="default">
          <div className="activity-card-heading">
            <span className="activity-number">挑战 {String(sessionState.currentIndex + 1).padStart(2, '0')}</span>
            <span className="activity-kind-label">{activity.kind === 'choice' ? '选择' : activity.kind === 'match' ? '配对' : activity.kind === 'order' ? '排序' : activity.kind === 'categorize' ? '分类' : activity.kind === 'measurement' ? '测量' : '计算'}</span>
          </div>
          <ActivityRenderer
            key={activity.id}
            activity={activity}
            onSolved={handleSolved}
            onAnswerResult={handleAnswerResult}
            selectMessage={getFeedbackMessage}
          />
        </Card>
        <div className={`game-navigation-row ${solved ? 'is-solved' : ''}`}>
          <p aria-live="polite">{solved ? '挑战完成！你的坚持又积累了一点能量，可以继续啦。' : '不着急，先读题找线索；愿意动脑尝试就很棒。'}</p>
          <Button type="primary" disabled={!solved} onClick={continueSession}>
            {sessionState.currentIndex === session.activities.length - 1 ? '完成本场' : '继续下一题'} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
