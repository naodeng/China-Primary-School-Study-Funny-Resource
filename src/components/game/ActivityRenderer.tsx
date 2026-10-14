import { useRef, useState } from 'react';
import type { ActivityDefinition } from '../../content/types';
import { submitAnswer } from '../../learning/answers';
import { selectFeedbackMessage } from '../../learning/feedback';
import type { FeedbackStatus } from '../../learning/feedback';
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
  onAnswerResult?: (status: FeedbackStatus, activityId: string) => void;
  random?: () => number;
  selectMessage?: (status: FeedbackStatus) => string;
}

export default function ActivityRenderer({ activity, onSolved, onAnswerResult, random, selectMessage }: ActivityRendererProps) {
  const [status, setStatus] = useState<ActivityFeedbackStatus>('unanswered');
  const [hintVisible, setHintVisible] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const solvedRef = useRef(false);
  const previousMessage = useRef<Record<FeedbackStatus, string | null>>({ correct: null, incorrect: null });

  function chooseMessage(nextStatus: FeedbackStatus): string {
    const selected = selectMessage
      ? selectMessage(nextStatus)
      : selectFeedbackMessage(nextStatus, previousMessage.current[nextStatus], random);
    previousMessage.current[nextStatus] = selected;
    return selected;
  }

  function submit(answer: unknown) {
    if (solvedRef.current) return;
    if (submitAnswer(activity, answer)) {
      solvedRef.current = true;
      setStatus('correct');
      setMessage(chooseMessage('correct'));
      onAnswerResult?.('correct', activity.id);
      onSolved(activity.id);
    } else {
      setStatus('incorrect');
      setMessage(chooseMessage('incorrect'));
      onAnswerResult?.('incorrect', activity.id);
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
    activityControl = <MatchActivity key={attempt} activity={activity} disabled={status === 'correct'} onSubmit={submit} random={random} />;
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
        status={status}
        hint={activity.hint}
        explanation={activity.explanation}
        hintVisible={hintVisible}
        message={message}
        onShowHint={() => {
          setHintVisible(true);
          setStatus('hint');
        }}
        onRetry={retry}
      />
    </section>
  );
}
