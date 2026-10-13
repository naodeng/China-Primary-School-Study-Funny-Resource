import { Button, Card } from 'animal-island-ui';
import type { CosmicRank } from '../../achievements/progress';
import type { LearningSession, SubjectId } from '../../content/types';
import HeroGuide from '../mascots/HeroGuide';

interface SessionSummaryProps {
  session: LearningSession;
  subject: SubjectId;
  newlyUnlockedRank: CosmicRank | null;
  onExit: () => void;
  onReplay: () => void;
}

export default function SessionSummary({ session, subject, newlyUnlockedRank, onExit, onReplay }: SessionSummaryProps) {
  return (
    <main className="game-page">
      <div className="game-shell">
        <Card className="session-finish-card" color="app-green">
          <span className="finish-emblem" aria-hidden="true">✦</span>
          <p className="eyebrow">任务完成</p>
          <h1>太棒了，能量收集完成！</h1>
          <p>你完成了“{session.title}”里的 {session.activities.length} 个小挑战，这份认真和坚持值得一枚星章！</p>
          <div className="earned-star" role="img" aria-label="获得一枚星章">⭐</div>
          {newlyUnlockedRank && (
            <div className="summary-achievement" role="status">
              <span>新头衔解锁</span>
              <strong><span aria-hidden="true">{newlyUnlockedRank.symbol}</span> {newlyUnlockedRank.title}</strong>
              <p>{newlyUnlockedRank.description}。继续按自己的节奏探索吧！</p>
            </div>
          )}
          <HeroGuide mood="celebrate" subject={subject} companionId={session.companionId} />
          <div className="finish-actions">
            <Button type="primary" onClick={onExit}>回到单元</Button>
            <Button type="default" onClick={onReplay}>再玩一次</Button>
          </div>
          <p className="summary-kindness">每次认真尝试都值得肯定。想休息就休息，准备好了再继续探索。</p>
        </Card>
      </div>
    </main>
  );
}
