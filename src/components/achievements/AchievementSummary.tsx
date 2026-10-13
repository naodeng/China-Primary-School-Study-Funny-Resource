import { Button, Card } from 'animal-island-ui';
import { COSMIC_RANKS, getCompletedUnitCount, getCosmicRank } from '../../achievements/progress';
import { getKnownCurriculumPositions } from '../../achievements/position';
import type { LearningPosition } from '../../achievements/position';

interface AchievementSummaryProps {
  completedSessionIds: string[];
  learningStart: LearningPosition | null;
  onNavigate: (path: string) => void;
}

export default function AchievementSummary({ completedSessionIds, learningStart, onNavigate }: AchievementSummaryProps) {
  const completedCount = getCompletedUnitCount(completedSessionIds, learningStart);
  const currentRank = getCosmicRank(completedCount);
  const nextRank = COSMIC_RANKS.find((rank) => rank.unitsRequired > completedCount);
  const knownCount = getKnownCurriculumPositions().length;
  const rankStart = currentRank.unitsRequired;
  const rankProgress = nextRank
    ? Math.min(100, ((completedCount - rankStart) / (nextRank.unitsRequired - rankStart)) * 100)
    : 100;

  return (
    <section className="achievement-summary-section" aria-labelledby="achievement-summary-heading">
      <Card className="achievement-summary-card" color="app-green">
        <div className="achievement-summary-main">
          <span className="achievement-summary-symbol" aria-hidden="true">{currentRank.symbol}</span>
          <div className="achievement-summary-copy">
            <p className="eyebrow">我的探索进度</p>
            <h2 id="achievement-summary-heading">{currentRank.title}</h2>
            <p>已点亮 <strong>{completedCount}</strong> 个已登记单元。每一步努力都在发光！</p>
            {learningStart ? (
              <p className="achievement-summary-start">学习起点：{learningStart.grade} 年级{learningStart.term === 1 ? '上' : '下'}学期 · 第 {learningStart.unit} 单元</p>
            ) : null}
            {nextRank ? (
              <div className="achievement-summary-next">
                <div className="achievement-summary-next-label">
                  <span>下一头衔：{nextRank.title}</span>
                  <span>还差 {nextRank.unitsRequired - completedCount} 个完整单元</span>
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
          查看成就详情 <span aria-hidden="true">→</span>
        </Button>
      </Card>
      <p className="achievement-summary-footnote">当前按已登记的 {knownCount} 个单元计算；新增教材后，星图会继续扩展。</p>
    </section>
  );
}
