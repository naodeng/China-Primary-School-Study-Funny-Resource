import { Button, Card } from 'animal-island-ui';
import type { FeedbackStatus } from '../../learning/feedback';

export type ActivityFeedbackStatus = 'unanswered' | 'hint' | FeedbackStatus;

interface ActivityFeedbackProps {
  status: ActivityFeedbackStatus;
  hint: string;
  explanation: string;
  hintVisible: boolean;
  message: string | null;
  onShowHint: () => void;
  onRetry: () => void;
}

export default function ActivityFeedback({ status, hint, explanation, hintVisible, message, onShowHint, onRetry }: ActivityFeedbackProps) {
  if (status === 'correct') {
    return (
      <Card className="activity-feedback is-correct" color="default" role="status">
        <strong>{message}</strong>
        <p>{explanation}</p>
      </Card>
    );
  }
  if (status === 'incorrect') {
    return (
      <Card className="activity-feedback is-incorrect" color="default" role="status">
        <strong>{message}</strong>
        {hintVisible && <p className="feedback-hint">小提示：{hint}</p>}
        <Button type="default" className="activity-submit-action" onClick={onRetry}>再试一次</Button>
      </Card>
    );
  }
  return (
    <div className="activity-guidance" aria-live="polite">
      {hintVisible ? <p className="feedback-hint">小提示：{hint}</p> : <span>勇敢试一试吧，每次尝试都能帮你发现新线索。</span>}
      {!hintVisible && status !== 'hint' && <Button type="text" onClick={onShowHint}>给我一点提示</Button>}
    </div>
  );
}
