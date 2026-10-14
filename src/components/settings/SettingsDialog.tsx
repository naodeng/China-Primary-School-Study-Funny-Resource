import { useEffect, useRef, useState } from 'react';
import { Button } from 'animal-island-ui';
import { getRegisteredLearningPositions } from '../../achievements/position';
import type { LearningPosition } from '../../achievements/position';
import type { ProgressState } from '../../storage/progress';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import { useSound } from '../../sound/SoundProvider';

interface SettingsDialogProps {
  open: boolean;
  progress: ProgressState;
  onClose: () => void;
  onApplyLearningStart: (position: LearningPosition) => void;
  onNavigate: (path: string) => void;
}

const DEFAULT_START: LearningPosition = { grade: 2, term: 1, unit: 1 };

function getInitialPosition(progress: ProgressState): LearningPosition {
  const positions = getRegisteredLearningPositions();
  const preferred = progress.learningStart ?? DEFAULT_START;
  return positions.find((position) => position.grade === preferred.grade
    && position.term === preferred.term && position.unit === preferred.unit) ?? progress.learningStart ?? positions[0] ?? DEFAULT_START;
}

export default function SettingsDialog({ open, progress, onClose, onApplyLearningStart, onNavigate }: SettingsDialogProps) {
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useSound();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const initialPosition = getInitialPosition(progress);
  const [grade, setGrade] = useState(String(initialPosition.grade));
  const [term, setTerm] = useState(String(initialPosition.term));
  const [unit, setUnit] = useState(String(initialPosition.unit));
  const [saved, setSaved] = useState(false);
  const positions = getRegisteredLearningPositions();
  const hasUnregisteredSavedStart = Boolean(progress.learningStart && !positions.some((position) => (
    position.grade === progress.learningStart!.grade
      && position.term === progress.learningStart!.term
      && position.unit === progress.learningStart!.unit
  )));
  const gradeOptions = [...new Set([
    ...positions.map((position) => position.grade),
    ...(hasUnregisteredSavedStart ? [progress.learningStart!.grade] : []),
  ])];
  const termOptions = [...new Set([
    ...positions.filter((position) => position.grade === Number(grade)).map((position) => position.term),
    ...(hasUnregisteredSavedStart && progress.learningStart!.grade === Number(grade) ? [progress.learningStart!.term] : []),
  ])];
  const unitOptions = [...new Set([
    ...positions.filter((position) => position.grade === Number(grade) && position.term === Number(term)).map((position) => position.unit),
    ...(hasUnregisteredSavedStart && progress.learningStart!.grade === Number(grade) && progress.learningStart!.term === Number(term)
      ? [progress.learningStart!.unit]
      : []),
  ])];
  const selectedPositionIsRegistered = positions.some((position) => (
    position.grade === Number(grade) && position.term === Number(term) && position.unit === Number(unit)
  ));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>('.settings-dialog-close')?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const position = getInitialPosition(progress);
    setGrade(String(position.grade));
    setTerm(String(position.term));
    setUnit(String(position.unit));
    setSaved(false);
  }, [open]);

  function applyLearningStart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedGrade = Number(grade);
    const selectedTermValue = Number(term);
    const selectedUnit = Number(unit);
    if (!Number.isInteger(selectedGrade) || (selectedTermValue !== 1 && selectedTermValue !== 2) || !Number.isSafeInteger(selectedUnit)
      || !positions.some((position) => position.grade === selectedGrade
        && position.term === selectedTermValue && position.unit === selectedUnit)) return;

    onApplyLearningStart({ grade: selectedGrade, term: selectedTermValue, unit: selectedUnit });
    setSaved(true);
  }

  function openAchievements() {
    onClose();
    onNavigate('/achievements');
  }

  return (
    <dialog
      className="settings-dialog"
      ref={dialogRef}
      aria-labelledby="settings-heading"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="settings-dialog-panel">
        <header className="settings-dialog-header">
          <div>
            <p className="eyebrow">飞船控制台</p>
            <h2 id="settings-heading">设置</h2>
          </div>
          <Button type="default" className="settings-dialog-close" aria-label="关闭设置" onClick={onClose}>关闭</Button>
        </header>

        <section className="settings-section" aria-labelledby="settings-theme-heading">
          <h3 id="settings-theme-heading">显示主题</h3>
          <p>选择适合现在环境的颜色，也可以跟随设备设置。</p>
          <ThemeSwitcher />
        </section>

        <section className="settings-section" aria-labelledby="settings-sound-heading" data-sound-silent="true">
          <h3 id="settings-sound-heading">语音与提示音</h3>
          <p>答题时听到鼓励，操作页面时也会有轻轻的提示音。</p>
          <label className="settings-sound-control">
            <span>
              <strong>语音提示与交互音效</strong>
              <span className="settings-sound-state" role="status">{soundEnabled ? '已开启' : '已关闭'}</span>
            </span>
            <input
              type="checkbox"
              role="switch"
              aria-label="语音提示与交互音效"
              checked={soundEnabled}
              onChange={(event) => setSoundEnabled(event.currentTarget.checked)}
            />
          </label>
        </section>

        <section className="settings-section settings-achievement-link" aria-labelledby="settings-achievement-heading">
          <div>
            <h3 id="settings-achievement-heading">我的成就</h3>
            <p>查看已点亮的星区、课程进度和已获得头衔。</p>
          </div>
          <Button type="default" onClick={openAchievements}>查看成就详情 <span aria-hidden="true">→</span></Button>
        </section>

        <section className="settings-section" aria-labelledby="settings-progress-heading">
          <h3 id="settings-progress-heading">学习进度设置</h3>
          <p>选择接下来要开始的位置，适合已经学过前面课程的同学。</p>
          <form className="learning-start-form" onSubmit={applyLearningStart}>
            <div className="learning-start-fields">
              <label>
                <span>年级</span>
                <select value={grade} onChange={(event) => {
                  const nextGrade = Number(event.target.value);
                  const nextPosition = positions.find((position) => position.grade === nextGrade);
                  if (!nextPosition) return;
                  setGrade(String(nextGrade));
                  setTerm(String(nextPosition.term));
                  setUnit(String(nextPosition.unit));
                }}>
                  {gradeOptions.map((number) => {
                    const unregistered = hasUnregisteredSavedStart
                      && progress.learningStart!.grade === number
                      && !positions.some((position) => position.grade === number);
                    return <option key={number} value={number} disabled={unregistered}>
                      {number} 年级{unregistered ? '（当前起点未登记）' : ''}
                    </option>;
                  })}
                </select>
              </label>
              <label>
                <span>学期</span>
                <select value={term} onChange={(event) => {
                  const nextTerm = Number(event.target.value);
                  const nextPosition = positions.find((position) => position.grade === Number(grade) && position.term === nextTerm);
                  if (!nextPosition) return;
                  setTerm(String(nextTerm));
                  setUnit(String(nextPosition.unit));
                }}>
                  {termOptions.map((number) => {
                    const unregistered = hasUnregisteredSavedStart
                      && progress.learningStart!.grade === Number(grade)
                      && progress.learningStart!.term === number
                      && !positions.some((position) => position.grade === Number(grade) && position.term === number);
                    return <option key={number} value={number} disabled={unregistered}>
                      {number === 1 ? '上学期' : '下学期'}{unregistered ? '（当前起点未登记）' : ''}
                    </option>;
                  })}
                </select>
              </label>
              <label>
                <span>从第几单元开始</span>
                <select aria-label="从第几单元开始" value={unit} onChange={(event) => setUnit(event.target.value)} disabled={!unitOptions.length}>
                  {unitOptions.map((number) => {
                    const unregistered = hasUnregisteredSavedStart
                      && progress.learningStart!.grade === Number(grade)
                      && progress.learningStart!.term === Number(term)
                      && progress.learningStart!.unit === number
                      && !selectedPositionIsRegistered;
                    return <option key={number} value={number} disabled={unregistered}>
                      第 {number} 单元{unregistered ? '（当前起点未登记）' : ''}
                    </option>;
                  })}
                  {!unitOptions.length ? <option value="">暂无登记单元</option> : null}
                </select>
              </label>
            </div>
            <p className="learning-start-note">起点之前已登记的单元会记为已完成；从所选单元开始重新探索。课程加入后也会按这个起点计算。</p>
            {hasUnregisteredSavedStart && <p className="learning-start-note" role="status">当前保存的学习起点尚未登记到课程目录；选择已登记位置后，才能更新学习起点。</p>}
            <p className="learning-start-note">应用后会替换当前进度记录，只保存在这台设备的浏览器中。</p>
            <div className="learning-start-actions">
              <Button type="primary" htmlType="submit" disabled={!selectedPositionIsRegistered}>应用学习起点</Button>
              {saved ? <span role="status" className="learning-start-saved">已更新学习起点，星图也同步点亮啦！</span> : null}
            </div>
          </form>
        </section>
      </div>
    </dialog>
  );
}
