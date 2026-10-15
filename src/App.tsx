import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Button, Card } from 'animal-island-ui';
import type { CosmicRank } from './achievements/progress';
import { getNewCosmicRank } from './achievements/progress';
import { getTaskPath, resolveAppRoute, resolveRoute } from './app/router';
import type { AppRoute } from './app/router';
import ProjectLegalFooter from './components/layout/ProjectLegalFooter';
const CourseBreadcrumbs = lazy(() => import('./components/catalog/CourseBreadcrumbs'));
const CourseCatalog = lazy(() => import('./components/catalog/CourseCatalog'));
const UnitOverview = lazy(() => import('./components/catalog/UnitOverview'));
const SessionPlayer = lazy(() => import('./components/game/SessionPlayer'));
const AchievementPage = lazy(() => import('./components/achievements/AchievementPage'));
import './styles/catalog.css';
import './styles/game.css';
import { completeSession, loadProgress, setLearningStart } from './storage/progress';
import ThemeProvider from './theme/ThemeProvider';
import { SoundProvider, useSound } from './sound/SoundProvider';
import type { LearningPosition } from './achievements/position';
import { getEffectiveCompletedSessionIds } from './achievements/position';

function PageRouteEffects({ navigationRevision }: { navigationRevision: number }) {
  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>('.app-frame main');
    const heading = main?.querySelector<HTMLElement>('h1');
    const pageTitle = heading?.textContent?.trim() || heading?.querySelector('img')?.alt || '课程目录';
    document.title = pageTitle === '星岛学园 · Starry Island'
      ? '星岛学园 | Starry Island'
      : `${pageTitle} | 星岛学园`;
    if (navigationRevision === 0 || !heading) return;
    if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
    heading.dataset.routeFocus = 'true';
    heading.focus({ preventScroll: true });
  }, [navigationRevision]);

  return null;
}

function AppFrame({ page, navigationRevision }: { page: ReactNode; navigationRevision: number }) {
  const { playCue } = useSound();

  function playInteractionCue(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest<HTMLElement>(
      'button, a[href], select, input:not([type="hidden"]), textarea, summary, [role="button"], [role="combobox"], [role="switch"], [role="checkbox"], [role="radio"], [role="tab"]',
    );
    if (!control || control.matches(':disabled') || control.closest('[aria-disabled="true"], [data-sound-silent="true"]')) return;
    playCue('interaction-click');
  }

  return (
    <div className="app-frame" onClick={playInteractionCue}>
      <Suspense fallback={<RouteLoading message="正在准备这段学习旅程…" />}>
        <>{page}<PageRouteEffects key={navigationRevision} navigationRevision={navigationRevision} /></>
      </Suspense>
      <ProjectLegalFooter />
    </div>
  );
}

function RouteLoading({ message }: { message: string }) {
  return (
    <main className="route-message-page" aria-live="polite" aria-busy="true">
      <div className="catalog-shell">
        <section className="route-message-card">
          <p className="eyebrow">星岛航线连接中</p>
          <h1>{message}</h1>
          <p>马上就好，正在为你打开课程内容。</p>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute(window.location.pathname));
  const [navigationRevision, setNavigationRevision] = useState(0);
  const [progress, setProgress] = useState(() => loadProgress());
  const [newlyUnlockedRank, setNewlyUnlockedRank] = useState<CosmicRank | null>(null);
  const routeRequestId = useRef(0);
  const currentPathRef = useRef(window.location.pathname);
  const previousPathRef = useRef<string | null>(null);

  const applyRoute = useCallback((path: string) => {
    const requestId = ++routeRequestId.current;
    const immediateRoute = resolveRoute(path);
    setRoute(immediateRoute);
    setNavigationRevision((revision) => revision + 1);
    if (immediateRoute.kind !== 'loading') return;
    void resolveAppRoute(path).then((nextRoute) => {
      if (requestId !== routeRequestId.current) return;
      setRoute(nextRoute);
      setNavigationRevision((revision) => revision + 1);
    });
  }, []);

  useEffect(() => {
    applyRoute(window.location.pathname);
    const handlePopState = () => {
      previousPathRef.current = currentPathRef.current;
      currentPathRef.current = window.location.pathname;
      applyRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyRoute]);

  function navigate(path: string, options: { replaceHistory?: boolean } = {}) {
    previousPathRef.current = currentPathRef.current;
    if (options.replaceHistory) window.history.replaceState({}, '', path);
    else window.history.pushState({}, '', path);
    currentPathRef.current = path;
    applyRoute(window.location.pathname);
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
  if (route.kind === 'loading') {
    page = <RouteLoading message="正在打开课程" />;
  } else if (route.kind === 'loadError') {
    page = (
      <main className="route-message-page">
        <div className="catalog-shell">
          <Card className="route-message-card" color="default">
            <p className="eyebrow">航线连接遇到一点小波动</p>
            <h1>课程暂时没有打开</h1>
            <p>你的学习进度还在本机保存，可以再试一次。</p>
            <Button type="primary" onClick={() => navigate(route.path, { replaceHistory: true })}>重新加载</Button>
          </Card>
        </div>
      </main>
    );
  } else if (route.kind === 'catalog') {
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
        key={route.session.id}
        session={route.session}
        subject={route.unit.subject}
        newlyUnlockedRank={newlyUnlockedRank}
        onComplete={handleSessionComplete}
        onExit={() => {
          const taskPath = getTaskPath(route.unitKey, route.difficulty, route.task.id);
          if (previousPathRef.current === taskPath) {
            window.history.back();
            return;
          }
          navigate(taskPath, { replaceHistory: true });
        }}
      />
    );
  } else if (route.kind === 'comingSoon') {
    page = (
      <main className="route-message-page">
        <div className="catalog-shell">
          <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: route.title }]} onNavigate={navigate} />
          <Card className="route-message-card" color="default">
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
      <main className="route-message-page route-message-page--not-found">
        <div className="catalog-shell">
          <CourseBreadcrumbs items={[{ label: '课程目录', path: '/' }, { label: '页面未找到' }]} onNavigate={navigate} />
          <Card className="route-message-card" color="default">
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
    <SoundProvider>
      <ThemeProvider>
      <AppFrame page={page} navigationRevision={navigationRevision} />
      </ThemeProvider>
    </SoundProvider>
  );
}
