import { useEffect, useState } from 'react';
import { Button, Card } from 'animal-island-ui';
import { resolveRoute } from './app/router';
import type { AppRoute } from './app/router';
import CourseBreadcrumbs from './components/catalog/CourseBreadcrumbs';
import CourseCatalog from './components/catalog/CourseCatalog';
import UnitOverview from './components/catalog/UnitOverview';
import SessionPlayer from './components/game/SessionPlayer';
import './styles/catalog.css';
import './styles/game.css';
import { completeSession, loadProgress } from './storage/progress';

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute(window.location.pathname));
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    const handlePopState = () => setRoute(resolveRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, '', path);
    setRoute(resolveRoute(window.location.pathname));
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  }

  if (route.kind === 'catalog') return <CourseCatalog onNavigate={navigate} />;
  if (route.kind === 'unit') {
    return <UnitOverview unitKey={route.unitKey} unit={route.unit} completedSessionIds={progress.completedSessionIds} onNavigate={navigate} />;
  }
  if (route.kind === 'session') {
    return (
      <SessionPlayer
        session={route.session}
        subject={route.unit.subject}
        onComplete={(sessionId) => setProgress((current) => completeSession(current, sessionId))}
        onExit={() => navigate(`/${route.unitKey}`)}
      />
    );
  }
  if (route.kind === 'comingSoon') {
    return (
      <main className="route-message-page">
        <div className="catalog-shell">
          <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: route.title }]} onNavigate={navigate} />
          <Card className="route-message-card" color="app-yellow">
            <p className="eyebrow">学习小岛正在建设</p>
            <h1>{route.title}</h1>
            <p>这部分内容还在准备，先来玩已经开放的语文和数学单元吧。</p>
            <Button type="primary" onClick={() => navigate('/')}>回到课程目录</Button>
          </Card>
        </div>
      </main>
    );
  }
  return (
    <main className="route-message-page">
      <div className="catalog-shell">
        <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: '页面未找到' }]} onNavigate={navigate} />
        <Card className="route-message-card" color="app-red">
          <p className="eyebrow">路线暂时中断</p>
          <h1>没有找到这门课程</h1>
          <p>请从课程目录选择已开放的单元。</p>
          <Button type="primary" onClick={() => navigate('/')}>回到课程目录</Button>
        </Card>
      </div>
    </main>
  );
}
