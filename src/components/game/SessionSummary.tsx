import { Button, Card } from 'animal-island-ui';
import type { LearningSession, SubjectId } from '../../content/types';
import HeroGuide from '../mascots/HeroGuide';

interface SessionSummaryProps {
  session: LearningSession;
  subject: SubjectId;
  onExit: () => void;
  onReplay: () => void;
}

export default function SessionSummary({ session, subject, onExit, onReplay }: SessionSummaryProps) {
  return (
    <main className="game-page">
      <div className="game-shell">
        <Card className="session-finish-card" color="app-green">
          <span className="finish-emblem" aria-hidden="true">✦</span>
          <p className="eyebrow">任务完成</p>
          <h1>太棒了，能量收集完成！</h1>
          <p>你完成了“{session.title}”，给自己点亮一枚星章吧。</p>
          <div className="earned-star" role="img" aria-label="获得一枚星章">⭐</div>
          <HeroGuide mood="celebrate" subject={subject} companionId={session.companionId} />
          <div className="finish-actions">
            <Button type="primary" onClick={onExit}>回到单元</Button>
            <Button type="default" onClick={onReplay}>再玩一次</Button>
          </div>
          <p className="summary-kindness">每次认真尝试都值得肯定，休息好了再继续探索。</p>
        </Card>
      </div>
    </main>
  );
}
