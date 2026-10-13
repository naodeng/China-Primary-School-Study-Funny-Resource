import { Card } from 'animal-island-ui';
import { COSMIC_RANKS, getCompletedUnitCount, getCosmicRank, getLearningUnitProgress } from '../../achievements/progress';
import type { LearningPosition } from '../../achievements/position';
import { getExplorationZones } from '../../achievements/exploration';
import { getSessionsForDifficulty } from '../../content/sessionUtils';

interface AchievementDashboardProps {
  completedSessionIds: string[];
  learningStart: LearningPosition | null;
}

export default function AchievementDashboard({ completedSessionIds, learningStart }: AchievementDashboardProps) {
  const units = getLearningUnitProgress(completedSessionIds, learningStart);
  const zones = getExplorationZones(completedSessionIds, learningStart);
  const completedUnitCount = getCompletedUnitCount(completedSessionIds, learningStart);
  const currentRank = getCosmicRank(completedUnitCount);

  return (
    <section className="achievement-section" aria-labelledby="achievement-heading">
      <div className="achievement-section-heading">
        <div>
          <p className="eyebrow">我的学习星图</p>
          <h2 id="achievement-heading">每完成一点，星岛就亮一点</h2>
          <p>当前头衔：<strong>{currentRank.title}</strong> · 已完整点亮 <strong>{completedUnitCount}</strong> 座知识岛。慢慢来，你的每一步都算数！</p>
        </div>
        <span className="achievement-progress-orbit" aria-hidden="true">✦</span>
      </div>

      <div className="achievement-badge-grid" aria-label="单元成就">
        {COSMIC_RANKS.map((rank) => {
          const unlocked = completedUnitCount >= rank.unitsRequired;
          const current = currentRank.id === rank.id;
          const remaining = Math.max(0, rank.unitsRequired - completedUnitCount);
          return (
            <Card
              key={rank.id}
              className={`achievement-badge ${current ? 'is-current' : unlocked ? 'is-unlocked' : 'is-locked'}`}
              color="default"
              aria-label={`${rank.title}，${current ? '当前头衔' : unlocked ? '已获得' : `还需完成${remaining}个单元`}`}
            >
              <span className="achievement-badge-symbol" aria-hidden="true">{rank.symbol}</span>
              <span className="achievement-badge-state">{current ? '✓ 当前头衔' : unlocked ? '✓ 已获得' : `还差 ${remaining} 个完整单元`}</span>
              <strong>{rank.title}</strong>
              <span className="achievement-badge-description">{rank.description}</span>
              <span className="achievement-badge-count">
                {rank.unitsRequired === 0
                  ? '起点头衔'
                  : unlocked
                    ? `累计点亮 ${completedUnitCount} 个单元`
                    : `${completedUnitCount} / ${rank.unitsRequired} 个单元`}
              </span>
            </Card>
          );
        })}
      </div>

      <section className="exploration-map" aria-labelledby="exploration-map-heading">
        <div className="exploration-map-heading">
          <div>
            <p className="eyebrow">全年级星际航线</p>
            <h3 id="exploration-map-heading">12 个星区，等你逐站探索</h3>
            <p>每个学期是一片星区，教材里的每个单元都会变成一个探索节点。完成一单元，点亮一个节点。</p>
          </div>
          <span className="exploration-map-count" aria-label={`${zones.length} 个星区`}>✦ {zones.length} 星区</span>
        </div>

        <div className="exploration-zone-grid">
          {zones.map((zone) => {
            const groupedUnits = zone.units.reduce<Record<string, typeof zone.units>>((groups, unit) => {
              (groups[unit.subjectTitle] ??= []).push(unit);
              return groups;
            }, {});
            const zoneState = zone.isOpen ? 'is-open' : 'is-locked';

            return (
              <article
                className={`exploration-zone ${zoneState}`}
                key={zone.id}
                aria-label={`第${zone.number}星区：${zone.title}，${zone.gradeTitle}${zone.termTitle}`}
              >
                <header className="exploration-zone-header">
                  <span className="exploration-zone-symbol" aria-hidden="true">{zone.hasCurriculum || zone.isStartZone ? zone.symbol : '🔒'}</span>
                  <div className="exploration-zone-heading-copy">
                    <span className="exploration-zone-kicker">第{zone.number}星区 · {zone.gradeTitle}{zone.termTitle}</span>
                    <h4>{zone.title}</h4>
                  </div>
                  <span className={`exploration-zone-status ${zone.isOpen ? 'is-open' : 'is-locked'}`}>
                    {zone.isOpen ? '正在探索' : zone.hasCurriculum ? '课程筹备中' : '待解锁'}
                  </span>
                </header>

                <p className="exploration-zone-style">{zone.visualStyle}</p>
                <p className="exploration-zone-artifact">
                  {zone.isStartZone
                    ? `当前学习起点：第 ${zone.startUnit} 单元 · ${zone.unitArtifact}`
                    : zone.hasCurriculum
                      ? `单元节点：${zone.unitArtifact}`
                      : `未来节点：${zone.unitArtifact}`}
                </p>

                {zone.hasCurriculum ? (
                  <div className="exploration-subject-groups">
                    {Object.entries(groupedUnits).map(([subjectTitle, subjectUnits]) => (
                      <section className="exploration-subject-group" key={subjectTitle} aria-label={`${subjectTitle}单元节点`}>
                        <h5>{subjectTitle}</h5>
                        <ul className="exploration-unit-nodes">
                          {subjectUnits.map((unit) => (
                            <li
                              className={`exploration-unit-node is-${unit.state}`}
                              key={unit.id}
                              aria-label={`${subjectTitle}，${unit.title}，${unit.state === 'complete' ? '已点亮' : unit.state === 'available' ? `已完成${unit.completedSessions}场，共${unit.totalSessions}场` : unit.state === 'comingSoon' ? '正在准备' : '教材接入后开放'}`}
                            >
                              <span className="exploration-node-symbol" aria-hidden="true">
                                {unit.state === 'complete' ? '✓' : unit.state === 'available' ? '✦' : '◇'}
                              </span>
                              <span className="exploration-node-title">{unit.title}</span>
                              <span className="exploration-node-state">
                                {unit.state === 'complete'
                                  ? '已点亮'
                                  : unit.state === 'available'
                                    ? `${unit.completedSessions}/${unit.totalSessions} 场`
                                    : unit.state === 'comingSoon'
                                      ? '即将开放'
                                      : '待探索'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                    <p className="exploration-zone-note">{zone.isOpen ? '已接入的课程会显示闯关进度；灰色节点会在相应单元加入后逐步开放。' : '课程目录已规划，完成内容准备后就能出发探索。'}</p>
                  </div>
                ) : null}
                {zone.isStartZone && !zone.hasCurriculum ? (
                  <p className="exploration-zone-note">这片星区的课程还未接入；准备好内容后，就能从第 {zone.startUnit} 单元开始探索。</p>
                ) : null}
              </article>
            );
          })}
        </div>
        <p className="exploration-map-note">当前开放课程：二年级上学期。其他星区先展示主题，后续会随人教版课程内容接入，按教材单元补齐节点。</p>
      </section>

      <div className="achievement-detail-heading">
        <div>
          <h3>已接入课程的闯关记录</h3>
          <p>目前有 {units.length} 个单元进入学习计划；完成单元中的所有游戏，就能点亮对应星区节点。</p>
        </div>
      </div>

      <div className="achievement-unit-grid" aria-label="课程完成情况">
        {units.map((entry) => {
          const basicSessions = getSessionsForDifficulty(entry.unit, 'basic');
          const doneCount = entry.completedSessionIds.length;
          return (
            <article className={`achievement-unit ${entry.completed ? 'is-complete' : 'is-pending'}`} key={entry.key}>
              <header className="achievement-unit-header">
                <span className="achievement-unit-check" aria-hidden="true">{entry.completed ? '✓' : '○'}</span>
                <div>
                  <span className="achievement-unit-subject">{entry.gradeTitle} · {entry.termTitle} · {entry.subjectTitle}</span>
                  <h3>{entry.title}</h3>
                </div>
                <span className="achievement-unit-count">{doneCount} / {basicSessions.length}</span>
              </header>
              <ul className="achievement-session-list">
                {basicSessions.map((session) => {
                  const complete = entry.completedSessionIds.includes(session.id);
                  return (
                    <li className={complete ? 'is-complete' : 'is-pending'} key={session.id}>
                      <span aria-hidden="true">{complete ? '✓' : '○'}</span>
                      <span>{session.title}</span>
                      <span className="achievement-session-state">{complete ? '已完成' : '待探索'}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="achievement-kindness">不用着急赶路。做完眼前的一小场，就已经向下一枚徽章更近一步啦。</p>
    </section>
  );
}
