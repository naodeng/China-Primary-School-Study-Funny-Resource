import { useRef, useState } from 'react';
import type { ActivityDefinition } from '../../content/types';
import ActivityFeedback, { type ActivityFeedbackStatus } from './ActivityFeedback';
import CategorizeActivity from './CategorizeActivity';
import ChoiceActivity from './ChoiceActivity';
import ArithmeticActivity from './ArithmeticActivity';
import MeasurementActivity from './MeasurementActivity';
import MatchActivity from './MatchActivity';
import OrderActivity from './OrderActivity';

interface ActivityRendererProps {
  activity: ActivityDefinition;
  onSolved: (activityId: string) => void;
}

function isCorrect(activity: ActivityDefinition, answer: unknown): boolean {
  if (activity.kind === 'choice') return answer === activity.correctOptionId;
  if (activity.kind === 'match') {
    const submitted = answer as Record<string, string>;
    return activity.pairs.every((pair) => submitted[pair.id] === pair.id);
  }
  if (activity.kind === 'order') {
    const submitted = answer as string[];
    return submitted.length === activity.correctOrder.length && submitted.every((id, index) => id === activity.correctOrder[index]);
  }
  if (activity.kind === 'categorize') {
    const submitted = answer as Record<string, string>;
    return activity.items.every((item) => submitted[item.id] === item.categoryId);
  }
  if (activity.kind === 'arithmetic') return Number(answer) === activity.correctAnswer;
  return Number(answer) === activity.targetLengthCm;
}

export default function ActivityRenderer({ activity, onSolved }: ActivityRendererProps) {
  const [status, setStatus] = useState<ActivityFeedbackStatus>('unanswered');
  const [hintVisible, setHintVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const solvedRef = useRef(false);

  function submit(answer: unknown) {
    if (solvedRef.current) return;
    if (isCorrect(activity, answer)) {
      solvedRef.current = true;
      setStatus('correct');
      onSolved(activity.id);
    } else {
      setStatus('incorrect');
    }
  }

  function retry() {
    if (solvedRef.current) return;
    setAttempt((value) => value + 1);
    setStatus(hintVisible ? 'hint' : 'unanswered');
  }

  let activityControl;
  if (activity.kind === 'choice') {
    activityControl = <ChoiceActivity key={attempt} activity={activity} disabled={status === 'correct'} onSubmit={submit} />;
  } else if (activity.kind === 'match') {
    activityControl = <MatchActivity key={attempt} activity={activity} disabled={status === 'correct'} onSubmit={submit} />;
  } else if (activity.kind === 'order') {
    activityControl = <OrderActivity key={attempt} activity={activity} disabled={status === 'correct'} onSubmit={submit} />;
  } else if (activity.kind === 'categorize') {
    activityControl = <CategorizeActivity key={attempt} activity={activity} disabled={status === 'correct'} onSubmit={submit} />;
  } else if (activity.kind === 'measurement') {
    activityControl = <MeasurementActivity key={attempt} activity={activity} disabled={status === 'correct'} onSubmit={submit} />;
  } else {
    activityControl = <ArithmeticActivity key={attempt} activity={activity} disabled={status === 'correct'} showSteps={status === 'correct'} onSubmit={submit} />;
  }

  return (
    <section className="activity-renderer" aria-labelledby={`activity-${activity.id}`}>
      <div className="activity-prompt-row">
        <span className="activity-symbol" aria-hidden="true">✦</span>
        <h2 id={`activity-${activity.id}`}>{activity.prompt}</h2>
      </div>
      {activityControl}
      <ActivityFeedback
        activityId={activity.id}
        status={status}
        hint={activity.hint}
        explanation={activity.explanation}
        hintVisible={hintVisible}
        onShowHint={() => {
          setHintVisible(true);
          setStatus('hint');
        }}
        onRetry={retry}
      />
    </section>
  );
}
