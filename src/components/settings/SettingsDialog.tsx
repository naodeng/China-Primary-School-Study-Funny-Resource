import { useEffect, useRef, useState } from 'react';
import { Button } from 'animal-island-ui';
import type { LearningPosition } from '../../achievements/position';
import type { ProgressState } from '../../storage/progress';
import ThemeSwitcher from '../theme/ThemeSwitcher';

interface SettingsDialogProps {
  open: boolean;
  progress: ProgressState;
  onClose: () => void;
  onApplyLearningStart: (position: LearningPosition) => void;
  onNavigate: (path: string) => void;
}

const DEFAULT_START: LearningPosition = { grade: 2, term: 1, unit: 1 };

export default function SettingsDialog({ open, progress, onClose, onApplyLearningStart, onNavigate }: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [grade, setGrade] = useState(String(progress.learningStart?.grade ?? DEFAULT_START.grade));
  const [term, setTerm] = useState(String(progress.learningStart?.term ?? DEFAULT_START.term));
  const [unit, setUnit] = useState(String(progress.learningStart?.unit ?? DEFAULT_START.unit));
  const [saved, setSaved] = useState(false);

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
    setGrade(String(progress.learningStart?.grade ?? DEFAULT_START.grade));
    setTerm(String(progress.learningStart?.term ?? DEFAULT_START.term));
    setUnit(String(progress.learningStart?.unit ?? DEFAULT_START.unit));
    setSaved(false);
  }, [open]);

  function applyLearningStart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedGrade = Number(grade);
    const selectedTerm = Number(term);
    const selectedUnit = Number(unit);
    if (!Number.isInteger(selectedGrade) || selectedGrade < 1 || selectedGrade > 6
      || (selectedTerm !== 1 && selectedTerm !== 2)
      || !Number.isSafeInteger(selectedUnit) || selectedUnit < 1) return;

    onApplyLearningStart({ grade: selectedGrade, term: selectedTerm, unit: selectedUnit });
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
                <select value={grade} onChange={(event) => setGrade(event.target.value)}>
                  {Array.from({ length: 6 }, (_, index) => index + 1).map((number) => (
                    <option key={number} value={number}>{number} 年级</option>
                  ))}
                </select>
              </label>
              <label>
                <span>学期</span>
                <select value={term} onChange={(event) => setTerm(event.target.value)}>
                  <option value="1">上学期</option>
                  <option value="2">下学期</option>
                </select>
              </label>
              <label>
                <span>从第几单元开始</span>
                <input min="1" step="1" type="number" inputMode="numeric" value={unit} onChange={(event) => setUnit(event.target.value)} required />
              </label>
            </div>
            <p className="learning-start-note">起点之前的课程会记为已完成；从所选单元开始重新探索。以后接入的课程也会按这个起点计算。</p>
            <p className="learning-start-note">应用后会替换当前进度记录，只保存在这台设备的浏览器中。</p>
            <div className="learning-start-actions">
              <Button type="primary" htmlType="submit">应用学习起点</Button>
              {saved ? <span role="status" className="learning-start-saved">已更新学习起点，星图也同步点亮啦！</span> : null}
            </div>
          </form>
        </section>
      </div>
    </dialog>
  );
}
