import { useEffect, useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import type { CosmicRank } from './achievements/progress';
import { getNewCosmicRank } from './achievements/progress';
import { getTaskPath, resolveRoute } from './app/router';
import type { AppRoute } from './app/router';
import CourseBreadcrumbs from './components/catalog/CourseBreadcrumbs';
import CourseCatalog from './components/catalog/CourseCatalog';
import UnitOverview from './components/catalog/UnitOverview';
import SessionPlayer from './components/game/SessionPlayer';
import AchievementPage from './components/achievements/AchievementPage';
import './styles/catalog.css';
import './styles/game.css';
import { completeSession, loadProgress, setLearningStart } from './storage/progress';
import ThemeProvider from './theme/ThemeProvider';
import type { LearningPosition } from './achievements/position';
import { getEffectiveCompletedSessionIds } from './achievements/position';

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute(window.location.pathname));
  const [progress, setProgress] = useState(() => loadProgress());
  const [newlyUnlockedRank, setNewlyUnlockedRank] = useState<CosmicRank | null>(null);

  useEffect(() => {
    const handlePopState = () => setRoute(resolveRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, '', path);
    setRoute(resolveRoute(window.location.pathname));
    setNewlyUnlockedRank(null);
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }

  function handleSessionComplete(sessionId: string) {
    const nextProgress = completeSession(progress, sessionId);
    setNewlyUnlockedRank(getNewCosmicRank(progress.completedSessionIds, nextProgress.completedSessionIds, progress.learningStart));
    setProgress(nextProgress);
  }

  function handleLearningStart(position: LearningPosition) {
    setProgress(setLearningStart(position));
    setNewlyUnlockedRank(null);
  }

  const effectiveCompletedSessionIds = getEffectiveCompletedSessionIds(progress.completedSessionIds, progress.learningStart);
  let page;
  if (route.kind === 'catalog') {
    page = <CourseCatalog progress={progress} onNavigate={navigate} onApplyLearningStart={handleLearningStart} />;
  } else if (route.kind === 'achievements') {
    page = <AchievementPage progress={progress} onNavigate={navigate} />;
  } else if (route.kind === 'unit') {
    page = <UnitOverview unitKey={route.unitKey} unit={route.unit} completedSessionIds={effectiveCompletedSessionIds} onNavigate={navigate} />;
  } else if (route.kind === 'task') {
    page = (
      <UnitOverview
        unitKey={route.unitKey}
        unit={route.unit}
        selectedDifficulty={route.difficulty}
        selectedTask={route.task}
        completedSessionIds={effectiveCompletedSessionIds}
        onNavigate={navigate}
      />
    );
  } else if (route.kind === 'session') {
    page = (
      <SessionPlayer
        session={route.session}
        subject={route.unit.subject}
        newlyUnlockedRank={newlyUnlockedRank}
        onComplete={handleSessionComplete}
        onExit={() => navigate(getTaskPath(route.unitKey, route.difficulty, route.task.id))}
      />
    );
  } else if (route.kind === 'comingSoon') {
    page = (
      <main className="route-message-page">
        <div className="catalog-shell">
          <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: route.title }]} onNavigate={navigate} />
          <Card className="route-message-card" color="app-yellow">
            <p className="eyebrow">学习小岛正在建设</p>
            <h1>{route.title}</h1>
            <p>我们正在核对教材版本、设计合适的小游戏，准备好后就会开放。</p>
            <Button type="primary" onClick={() => navigate('/')}>回到课程目录</Button>
          </Card>
        </div>
      </main>
    );
  } else {
    page = (
      <main className="route-message-page">
        <div className="catalog-shell">
          <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: '页面未找到' }]} onNavigate={navigate} />
          <Card className="route-message-card" color="app-red">
            <p className="eyebrow">路线暂时中断</p>
            <h1>没有找到这门课程</h1>
            <p>别担心，从课程目录重新选择一座已经开放的学习岛吧。</p>
            <Button type="primary" onClick={() => navigate('/')}>回到课程目录</Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <ThemeProvider>
      <div className="app-frame">
        {page}
      </div>
    </ThemeProvider>
  );
}
