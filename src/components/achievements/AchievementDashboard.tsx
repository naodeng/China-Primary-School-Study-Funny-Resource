import { useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import { ArrowRightIcon, CheckCircleIcon, CheckIcon, ClockIcon, CompassIcon, FlameIcon, GlobeIcon, KeyIcon, LockIcon, MapIcon, MoonIcon, RefreshIcon, RocketIcon, ShieldIcon, StarIcon, TrophyIcon, WaterCupIcon } from 'naive-icons';
import { COSMIC_RANKS, getCompletedUnitCount, getCosmicRank, getLearningUnitProgress } from '../../achievements/progress';
import type { LearningPosition } from '../../achievements/position';
import { getExplorationZones } from '../../achievements/exploration';

const RANK_ICONS = [RocketIcon, MoonIcon, StarIcon, GlobeIcon, TrophyIcon] as const;
const ZONE_ICONS = [MoonIcon, FlameIcon, RocketIcon, RefreshIcon, GlobeIcon, CompassIcon, ShieldIcon, StarIcon, KeyIcon, MapIcon, WaterCupIcon, TrophyIcon] as const;

interface AchievementDashboardProps {
  completedSessionIds: string[];
  learningStart: LearningPosition | null;
}

export default function AchievementDashboard({ completedSessionIds, learningStart }: AchievementDashboardProps) {
  const units = getLearningUnitProgress(completedSessionIds, learningStart);
  const zones = getExplorationZones(completedSessionIds, learningStart);
  const completedUnitCount = getCompletedUnitCount(completedSessionIds, learningStart);
  const currentRank = getCosmicRank(completedUnitCount);
  const nextRank = COSMIC_RANKS.find((rank) => rank.unitsRequired > completedUnitCount);
  const rankProgress = nextRank
    ? Math.round(((completedUnitCount - currentRank.unitsRequired) / (nextRank.unitsRequired - currentRank.unitsRequired)) * 100)
    : 100;
  const progressGroups = units.reduce<Array<{
    key: string;
    gradeTitle: string;
    termTitle: string;
    subjectTitle: string;
    units: typeof units;
  }>>((groups, entry) => {
    const key = `${entry.gradeTitle}|${entry.termTitle}|${entry.subjectTitle}`;
    const existing = groups.find((group) => group.key === key);
    if (existing) existing.units.push(entry);
    else groups.push({
      key,
      gradeTitle: entry.gradeTitle,
      termTitle: entry.termTitle,
      subjectTitle: entry.subjectTitle,
      units: [entry],
    });
    return groups;
  }, []);
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
  const [expandedRecordGroupKey, setExpandedRecordGroupKey] = useState<string | null>(null);

  return (
    <>
      <section className="achievement-section achievement-journey-section" aria-labelledby="achievement-heading">
        <div className="achievement-section-heading">
          <div>
            <p className="eyebrow">我的学习星图</p>
            <h2 id="achievement-heading">每完成一点，星岛就亮一点</h2>
            <p>当前头衔：<strong>{currentRank.title}</strong> · 已完整点亮 <strong>{completedUnitCount}</strong> 座知识岛。慢慢来，你的每一步都算数！</p>
          </div>
          <span className="achievement-progress-orbit" aria-hidden="true"><StarIcon size={28} /></span>
        </div>

        <div className="achievement-next-rank" aria-live="polite">
          <span className="achievement-next-rank-icon" aria-hidden="true"><TrophyIcon size={21} /></span>
          {nextRank ? (
            <div className="achievement-next-rank-copy">
              <div className="achievement-next-rank-label">
                <strong>下一站：{nextRank.title}</strong>
                <span>{nextRank.unitsRequired - completedUnitCount} 个完整单元后解锁</span>
              </div>
              <div className="achievement-next-rank-track" role="progressbar" aria-label={`距离${nextRank.title}的进度`} aria-valuenow={rankProgress} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${rankProgress}%` }} />
              </div>
            </div>
          ) : (
            <p className="achievement-next-rank-complete">所有头衔都已点亮，继续探索新的知识星球吧！</p>
          )}
        </div>

        <div className="achievement-badge-grid" aria-label="单元成就">
          {COSMIC_RANKS.map((rank, index) => {
            const RankIcon = RANK_ICONS[index] ?? StarIcon;
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
                <span className="achievement-badge-symbol" aria-hidden="true"><RankIcon size={25} /></span>
                <span className="achievement-badge-state">
                  {current || unlocked ? <CheckCircleIcon size={15} aria-hidden="true" /> : null}
                  {current ? '当前头衔' : unlocked ? '已获得' : `还差 ${remaining} 个单元`}
                </span>
                <strong>{rank.title}</strong>
                <span className="achievement-badge-description">{rank.description}</span>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="exploration-map" aria-labelledby="exploration-map-heading">
        <div className="exploration-map-heading">
          <div>
            <p className="eyebrow">全年级星际航线</p>
            <h3 id="exploration-map-heading">12 个星区，等你逐站探索</h3>
            <p>每个学期是一片星区，教材里的每个单元都会变成一个探索节点。完成一单元，点亮一个节点。</p>
          </div>
          <span className="exploration-map-count" aria-label={`${zones.length} 个星区`}><StarIcon size={16} aria-hidden="true" /> {zones.length} 星区</span>
        </div>

        <div className="exploration-zone-grid">
          {zones.map((zone) => {
            const ZoneIcon = ZONE_ICONS[(zone.number - 1) % ZONE_ICONS.length];
            const groupedUnits = zone.units.reduce<Record<string, typeof zone.units>>((groups, unit) => {
              (groups[unit.subjectTitle] ??= []).push(unit);
              return groups;
            }, {});
            const zoneState = zone.isOpen ? 'is-open' : 'is-locked';
            const expanded = expandedZoneId === zone.id;
            const zoneUnitsId = `exploration-zone-units-${zone.number}`;

            return (
              <article
                className={`exploration-zone ${zoneState}${expanded ? ' is-expanded' : ''}`}
                key={zone.id}
                aria-label={`第${zone.number}星区：${zone.title}，${zone.gradeTitle}${zone.termTitle}`}
              >
                <header className="exploration-zone-header">
                  <span className="exploration-zone-symbol" aria-hidden="true">
                    {zone.hasCurriculum || zone.isStartZone ? <ZoneIcon size={24} /> : <LockIcon size={20} />}
                  </span>
                  <div className="exploration-zone-heading-copy">
                    <span className="exploration-zone-kicker">第{zone.number}星区 · {zone.gradeTitle}{zone.termTitle}</span>
                    <h4>{zone.title}</h4>
                  </div>
                  <span className={`exploration-zone-status ${zone.isOpen ? 'is-open' : 'is-locked'}`}>
                    {zone.isStartZone ? '当前起点' : zone.hasCurriculum ? '课程已开放' : '待解锁'}
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
                  <div className="exploration-zone-progress-summary">
                    已点亮 {zone.completedUnitCount} / {zone.availableUnitCount} 个单元
                  </div>
                ) : null}
                {zone.hasCurriculum ? (
                  <Button
                    type="default"
                    className="exploration-zone-toggle"
                    aria-label={`${expanded ? '收起' : '查看'}第${zone.number}星区的单元进度`}
                    aria-expanded={expanded}
                    aria-controls={zoneUnitsId}
                    onClick={() => setExpandedZoneId(expanded ? null : zone.id)}
                  >
                    <span className="button-label-with-icon">{expanded ? '收起单元' : '查看单元进度'} <ArrowRightIcon size={16} aria-hidden="true" /></span>
                  </Button>
                ) : null}

                {zone.hasCurriculum ? (
                  <div className="exploration-subject-groups" id={zoneUnitsId} hidden={!expanded}>
                    {Object.entries(groupedUnits).map(([subjectTitle, subjectUnits]) => (
                      <section className="exploration-subject-group" key={subjectTitle} aria-label={`${subjectTitle}单元节点`}>
                        <h5>{subjectTitle}</h5>
                        <ul className="exploration-unit-nodes">
                          {subjectUnits.map((unit) => (
                            <li
                              className={`exploration-unit-node is-${unit.state}`}
                              key={unit.id}
                              aria-label={`${subjectTitle}，${unit.title}，${unit.state === 'complete' ? '已点亮' : unit.state === 'available' ? `已完成${unit.completedSessions}场，共${unit.totalSessions}场` : '正在准备'}`}
                            >
                              <span className="exploration-node-symbol" aria-hidden="true">
                                {unit.state === 'complete'
                                  ? <CheckCircleIcon size={16} />
                                  : unit.state === 'available'
                                    ? <StarIcon size={16} />
                                    : <LockIcon size={15} />}
                              </span>
                              <span className="exploration-node-title">{unit.title}</span>
                              <span className="exploration-node-state">
                                {unit.state === 'complete'
                                  ? '已点亮'
                                  : unit.state === 'available'
                                    ? `${unit.completedSessions}/${unit.totalSessions} 场`
                                    : '即将开放'}
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
        <p className="exploration-map-note">课程会在核实人教版教材后逐步开放；灰色节点仅作课程预告，暂不计入头衔。</p>
      </section>

      <section className="achievement-course-progress" aria-labelledby="achievement-course-progress-heading">
        <div className="achievement-detail-heading">
          <div>
            <p className="eyebrow">分学期查看</p>
            <h3 id="achievement-course-progress-heading">课程闯关记录</h3>
            <p>已登记 {units.length} 个单元。选一个学科，查看每场游戏的完成情况。</p>
          </div>
          <span className="achievement-record-total">{progressGroups.length} 组课程</span>
        </div>

        <div className="achievement-progress-group-list" aria-label="按学期和学科查看课程进度">
          {progressGroups.map((group, index) => {
            const expanded = expandedRecordGroupKey === group.key;
            const recordGroupId = `achievement-record-group-${index + 1}`;
            const completedInGroup = group.units.filter((entry) => entry.completed).length;
            return (
              <section className={`achievement-progress-group${expanded ? ' is-expanded' : ''}`} key={group.key}>
                <header className="achievement-progress-group-heading">
                  <div className="achievement-progress-group-title">
                    <span>{group.gradeTitle} · {group.termTitle}</span>
                    <h4>{group.subjectTitle}</h4>
                  </div>
                  <span className="achievement-progress-group-count">{completedInGroup} / {group.units.length} 个单元点亮</span>
                  <Button
                    type="default"
                    className="achievement-progress-group-toggle"
                    aria-label={`${expanded ? '收起' : '查看'}${group.gradeTitle}${group.termTitle}${group.subjectTitle}进度`}
                    aria-expanded={expanded}
                    aria-controls={recordGroupId}
                    onClick={() => setExpandedRecordGroupKey(expanded ? null : group.key)}
                  >
                    <span className="button-label-with-icon">{expanded ? '收起记录' : '查看进度'} <ArrowRightIcon size={16} aria-hidden="true" /></span>
                  </Button>
                </header>
                <div className="achievement-unit-grid" id={recordGroupId} aria-label={`${group.gradeTitle} ${group.termTitle} ${group.subjectTitle}课程完成情况`} hidden={!expanded}>
                  {group.units.map((entry) => {
                    const basicSessions = entry.basicSessions;
                    const doneCount = entry.completedSessionIds.length;
                    return (
                      <article className={`achievement-unit ${entry.completed ? 'is-complete' : 'is-pending'}`} key={entry.key}>
                        <header className="achievement-unit-header">
                          <span className="achievement-unit-check" aria-hidden="true">
                            {entry.completed ? <CheckCircleIcon size={18} /> : <ClockIcon size={17} />}
                          </span>
                          <div>
                            <span className="achievement-unit-subject">{entry.gradeTitle} · {entry.termTitle} · {entry.subjectTitle}</span>
                            <h5>{entry.title}</h5>
                          </div>
                          <span className="achievement-unit-count">{doneCount} / {basicSessions.length}</span>
                        </header>
                        <ul className="achievement-session-list">
                          {basicSessions.map((session) => {
                            const complete = entry.completedSessionIds.includes(session.id);
                            return (
                              <li className={complete ? 'is-complete' : 'is-pending'} key={session.id}>
                                <span aria-hidden="true">{complete ? <CheckIcon size={14} /> : <ClockIcon size={14} />}</span>
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
              </section>
            );
          })}
        </div>
        <p className="achievement-kindness">不用着急赶路。做完眼前的一小场，就已经向下一枚徽章更近一步啦。</p>
      </section>
    </>
  );
}
