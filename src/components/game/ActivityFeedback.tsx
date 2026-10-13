import { Button, Card } from 'animal-island-ui';

export type ActivityFeedbackStatus = 'unanswered' | 'hint' | 'incorrect' | 'correct';

interface ActivityFeedbackProps {
  status: ActivityFeedbackStatus;
  hint: string;
  explanation: string;
  hintVisible: boolean;
  onShowHint: () => void;
  onRetry: () => void;
}

export default function ActivityFeedback({ status, hint, explanation, hintVisible, onShowHint, onRetry }: ActivityFeedbackProps) {
  if (status === 'correct') {
    return (
      <Card className="activity-feedback is-correct" color="app-green" role="status">
        <strong>答对了，能量点亮！</strong>
        <p>{explanation}</p>
      </Card>
    );
  }
  if (status === 'incorrect') {
    return (
      <Card className="activity-feedback is-incorrect" color="app-yellow" role="status">
        <strong>还差一点点，再试试看。</strong>
        {hintVisible && <p className="feedback-hint">小提示：{hint}</p>}
        <Button type="default" onClick={onRetry}>再试一次</Button>
      </Card>
    );
  }
  return (
    <div className="activity-guidance" aria-live="polite">
      {hintVisible ? <p className="feedback-hint">小提示：{hint}</p> : <span>想好了再提交，答错可以重新尝试。</span>}
      {!hintVisible && status !== 'hint' && <Button type="text" onClick={onShowHint}>给我一点提示</Button>}
    </div>
  );
}
