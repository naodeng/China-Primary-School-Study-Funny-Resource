import { useState } from 'react';
import { Button } from 'animal-island-ui';
import { MinusIcon, PlusIcon } from 'naive-icons';
import type { MeasurementActivityDefinition } from '../../content/types';

interface MeasurementActivityProps {
  activity: MeasurementActivityDefinition;
  disabled: boolean;
  onSubmit: (answer: number) => void;
}

export default function MeasurementActivity({ activity, disabled, onSubmit }: MeasurementActivityProps) {
  const [value, setValue] = useState(activity.minCm);
  const tickCount = activity.maxCm - activity.minCm + 1;
  const objectWidth = activity.maxCm > 0
    ? Math.min(100, Math.max(0, (activity.targetLengthCm / activity.maxCm) * 100))
    : 0;

  return (
    <div className="measurement-activity">
      <div className="measurement-object-card" role="img" aria-label={`${activity.objectLabel}的长度示意图`}>
        <span className="measurement-object-label">{activity.objectLabel}</span>
        <span className="measurement-object-shape" style={{ width: `${Math.max(2, objectWidth)}%` }} />
      </div>
      <div className="ruler-face" aria-hidden="true">
        <div className="ruler-ticks" style={{ gridTemplateColumns: `repeat(${tickCount}, minmax(0, 1fr))` }}>
          {Array.from({ length: tickCount }, (_, index) => activity.minCm + index).map((tick) => (
            <span className="ruler-tick" key={tick}>
              <i className={tick % 5 === 0 ? 'is-major' : ''} />
              <small>{tick}</small>
            </span>
          ))}
        </div>
        <div className="ruler-unit">厘米</div>
      </div>
      <p className="measurement-slider-label" id={`measure-label-${activity.id}`}>调整终点</p>
      <div className="measurement-stepper" role="group" aria-labelledby={`measure-label-${activity.id}`}>
        <Button
          type="default"
          aria-label="减少 1 厘米"
          disabled={disabled || value <= activity.minCm}
          onClick={() => setValue((current) => Math.max(activity.minCm, current - 1))}
          icon={<MinusIcon size={18} aria-hidden="true" />}
        />
        <output className="measurement-value" aria-live="polite">{value} 厘米</output>
        <Button
          type="default"
          aria-label="增加 1 厘米"
          disabled={disabled || value >= activity.maxCm}
          onClick={() => setValue((current) => Math.min(activity.maxCm, current + 1))}
          icon={<PlusIcon size={18} aria-hidden="true" />}
        />
      </div>
      <div className="measurement-slider-ends" aria-hidden="true">
        <span>{activity.minCm} cm</span>
        <span>{activity.maxCm} cm</span>
      </div>
      <Button type="primary" className="activity-submit-action" disabled={disabled} onClick={() => onSubmit(value)}>检查长度</Button>
    </div>
  );
}
