import { Button, Card } from 'animal-island-ui';

export type ActivityFeedbackStatus = 'unanswered' | 'hint' | 'incorrect' | 'correct';

interface ActivityFeedbackProps {
  activityId: string;
  status: ActivityFeedbackStatus;
  hint: string;
  explanation: string;
  hintVisible: boolean;
  onShowHint: () => void;
  onRetry: () => void;
}

const ENCOURAGEMENTS = [
  '答对了！你刚刚又点亮了一颗知识星星。',
  '真棒！你认真观察，发现了关键线索。',
  '太好了！每一步思考都在积累能量。',
  '成功啦！你愿意动脑尝试，真的很棒。',
];

export default function ActivityFeedback({ activityId, status, hint, explanation, hintVisible, onShowHint, onRetry }: ActivityFeedbackProps) {
  if (status === 'correct') {
    const encouragement = ENCOURAGEMENTS[activityId.length % ENCOURAGEMENTS.length];
    return (
      <Card className="activity-feedback is-correct" color="app-green" role="status">
        <strong>{encouragement}</strong>
        <p>{explanation}</p>
      </Card>
    );
  }
  if (status === 'incorrect') {
    return (
      <Card className="activity-feedback is-incorrect" color="app-yellow" role="status">
        <strong>这次还没对上，没关系！看看线索，换个想法再试试。</strong>
        {hintVisible && <p className="feedback-hint">小提示：{hint}</p>}
        <Button type="default" onClick={onRetry}>再试一次</Button>
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
