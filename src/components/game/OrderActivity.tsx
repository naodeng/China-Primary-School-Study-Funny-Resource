import { useState } from 'react';
import { Button } from 'animal-island-ui';
import type { OrderActivityDefinition } from '../../content/types';

interface OrderActivityProps {
  activity: OrderActivityDefinition;
  disabled: boolean;
  onSubmit: (answer: string[]) => void;
}

function createInitialOrder(activity: OrderActivityDefinition): string[] {
  const order = activity.items.map((item) => item.id);
  const alreadySolved = order.length === activity.correctOrder.length
    && order.every((id, index) => id === activity.correctOrder[index]);

  if (alreadySolved && order.length > 1) {
    return [...order.slice(1), order[0]];
  }
  return order;
}

export default function OrderActivity({ activity, disabled, onSubmit }: OrderActivityProps) {
  const [order, setOrder] = useState(() => createInitialOrder(activity));
  function move(index: number, direction: -1 | 1) {
    const destination = index + direction;
    if (destination < 0 || destination >= order.length || disabled) return;
    setOrder((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }
  const labels = new Map(activity.items.map((item) => [item.id, item.label]));

  return (
    <div className="order-activity">
      <ol className="order-list" aria-label="当前排列顺序">
        {order.map((id, index) => (
          <li className="order-row" key={id}>
            <span className="order-index">{index + 1}</span>
            <span className="order-label">{labels.get(id)}</span>
            <div className="order-controls">
              <button type="button" aria-label={`上移 ${labels.get(id)}`} disabled={disabled || index === 0} onClick={() => move(index, -1)}>↑</button>
              <button type="button" aria-label={`下移 ${labels.get(id)}`} disabled={disabled || index === order.length - 1} onClick={() => move(index, 1)}>↓</button>
            </div>
          </li>
        ))}
      </ol>
      <Button type="primary" disabled={disabled} onClick={() => onSubmit(order)}>检查顺序</Button>
    </div>
  );
}
