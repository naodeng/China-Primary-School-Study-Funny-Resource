import { Button, Card } from 'animal-island-ui';
import { ArrowRightIcon } from 'naive-icons';
import { COSMIC_RANKS, getCompletedUnitCount, getCosmicRank } from '../../achievements/progress';
import type { LearningPosition } from '../../achievements/position';

interface AchievementSummaryProps {
  completedSessionIds: string[];
  learningStart: LearningPosition | null;
  onNavigate: (path: string) => void;
  compact?: boolean;
}

export default function AchievementSummary({ completedSessionIds, learningStart, onNavigate, compact = false }: AchievementSummaryProps) {
  const completedCount = getCompletedUnitCount(completedSessionIds, learningStart);
  const currentRank = getCosmicRank(completedCount);
  const nextRank = COSMIC_RANKS.find((rank) => rank.unitsRequired > completedCount);
  const rankStart = currentRank.unitsRequired;
  const rankProgress = nextRank
    ? Math.min(100, ((completedCount - rankStart) / (nextRank.unitsRequired - rankStart)) * 100)
    : 100;
  const remainingUnits = nextRank ? nextRank.unitsRequired - completedCount : 0;

  return (
    <section className={`achievement-summary-section${compact ? ' achievement-summary-section--compact' : ''}`} aria-labelledby="achievement-summary-heading">
      <Card className="achievement-summary-card" color="default">
        <div className="achievement-summary-main">
          <span
            className="achievement-summary-symbol"
            aria-hidden="true"
            style={{ background: `conic-gradient(var(--island-mint) ${rankProgress}%, var(--island-border) ${rankProgress}% 100%)` }}
          >
            <span>{completedCount}</span>
          </span>
          <div className="achievement-summary-copy">
            <p className="eyebrow">我的探索进度</p>
            <h2 id="achievement-summary-heading">{currentRank.title}</h2>
            <p>已点亮 <strong>{completedCount}</strong> 个完整单元</p>
            {nextRank ? (
              <div className="achievement-summary-next">
                <div className="achievement-summary-next-label">
                  <span>下一头衔：{nextRank.title}</span>
                  <span>{completedCount === 0 ? '完成第一个完整单元' : `还差 ${remainingUnits} 个完整单元`}</span>
                </div>
                <div className="achievement-summary-track" role="progressbar" aria-label={`距离${nextRank.title}的进度`} aria-valuenow={Math.round(rankProgress)} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${rankProgress}%` }} />
                </div>
              </div>
            ) : (
              <p className="achievement-summary-max">已收集全部探索头衔，继续发现新知识吧！</p>
            )}
          </div>
        </div>
        <Button type="default" onClick={() => onNavigate('/achievements')}>
          <span className="button-label-with-icon">成就详情 <ArrowRightIcon size={18} aria-hidden="true" /></span>
        </Button>
      </Card>
    </section>
  );
}
