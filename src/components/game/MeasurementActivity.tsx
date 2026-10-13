import { useState } from 'react';
import { Button } from 'animal-island-ui';
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
      <label className="measurement-slider-label" htmlFor={`measure-${activity.id}`}>
        调整终点：<strong>{value} 厘米</strong>
      </label>
      <input
        id={`measure-${activity.id}`}
        className="measurement-slider"
        type="range"
        min={activity.minCm}
        max={activity.maxCm}
        step="1"
        value={value}
        disabled={disabled}
        aria-label={`选择${activity.objectLabel}的长度，单位厘米`}
        aria-valuetext={`${value}厘米`}
        onChange={(event) => setValue(Number(event.target.value))}
      />
      <div className="measurement-slider-ends" aria-hidden="true">
        <span>{activity.minCm} cm</span>
        <span>{activity.maxCm} cm</span>
      </div>
      <Button type="primary" disabled={disabled} onClick={() => onSubmit(value)}>检查长度</Button>
    </div>
  );
}
