import type { ProgressState } from '../../storage/progress';
import AchievementDashboard from './AchievementDashboard';
import CourseBreadcrumbs from '../catalog/CourseBreadcrumbs';

export default function AchievementPage({ progress, onNavigate }: { progress: ProgressState; onNavigate: (path: string) => void }) {
  return (
    <main className="achievement-page">
      <div className="catalog-shell">
        <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: '我的成就' }]} onNavigate={onNavigate} />
        <header className="achievement-page-heading">
          <p className="eyebrow">飞船荣誉舱</p>
          <h1>我的成就星图</h1>
          <p>看看已经点亮的学习节点，也为下一段星际旅程加油。</p>
        </header>
        <AchievementDashboard completedSessionIds={progress.completedSessionIds} learningStart={progress.learningStart} />
      </div>
    </main>
  );
}
