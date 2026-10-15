import { useEffect, useState } from 'react';
import { Button, Modal, Select, Switch } from 'animal-island-ui';
import { ArrowRightIcon, CloseIcon } from 'naive-icons';
import { getRegisteredLearningPositions } from '../../achievements/position';
import type { LearningPosition } from '../../achievements/position';
import type { ProgressState } from '../../storage/progress';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import ProjectLegalFooter from '../layout/ProjectLegalFooter';
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
  const gradeSelectOptions = gradeOptions.map((number) => {
    const unregistered = hasUnregisteredSavedStart
      && progress.learningStart!.grade === number
      && !positions.some((position) => position.grade === number);
    return { key: String(number), label: `${number} 年级${unregistered ? '（当前起点未登记）' : ''}` };
  });
  const termSelectOptions = termOptions.map((number) => {
    const unregistered = hasUnregisteredSavedStart
      && progress.learningStart!.grade === Number(grade)
      && progress.learningStart!.term === number
      && !positions.some((position) => position.grade === Number(grade) && position.term === number);
    return { key: String(number), label: `${number === 1 ? '上学期' : '下学期'}${unregistered ? '（当前起点未登记）' : ''}` };
  });
  const unitSelectOptions = unitOptions.length
    ? unitOptions.map((number) => {
      const unregistered = hasUnregisteredSavedStart
        && progress.learningStart!.grade === Number(grade)
        && progress.learningStart!.term === Number(term)
        && progress.learningStart!.unit === number
        && !selectedPositionIsRegistered;
      return { key: String(number), label: `第 ${number} 单元${unregistered ? '（当前起点未登记）' : ''}` };
    })
    : [{ key: '', label: '暂无登记单元' }];

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
    <Modal
      open={open}
      variant="game"
      title="设置"
      width="min(760px, calc(100vw - 24px))"
      className="settings-modal"
      typewriter={false}
      footer={null}
      onClose={onClose}
    >
      <div className="settings-modal-content">
        <header className="settings-dialog-header">
          <p className="eyebrow">飞船控制台</p>
          <Button type="default" className="settings-dialog-close" aria-label="关闭设置" icon={<CloseIcon size={18} aria-hidden="true" />} onClick={onClose}>关闭</Button>
        </header>

        <section className="settings-section" aria-labelledby="settings-theme-heading">
          <h3 id="settings-theme-heading">显示主题</h3>
          <p>选择适合现在环境的颜色，也可以跟随设备设置。</p>
          <ThemeSwitcher />
        </section>

        <section className="settings-section" aria-labelledby="settings-sound-heading" data-sound-silent="true">
          <h3 id="settings-sound-heading">语音与提示音</h3>
          <p>答题时听到鼓励，操作页面时也会有轻轻的提示音。</p>
          <div className="settings-sound-control">
            <span>
              <strong id="settings-sound-control-label">语音提示与交互音效</strong>
              <span className="settings-sound-state" role="status">{soundEnabled ? '已开启' : '已关闭'}</span>
            </span>
            <Switch
              aria-labelledby="settings-sound-control-label"
              checked={soundEnabled}
              onChange={setSoundEnabled}
            />
          </div>
        </section>

        <section className="settings-section settings-achievement-link" aria-labelledby="settings-achievement-heading">
          <div>
            <h3 id="settings-achievement-heading">我的成就</h3>
            <p>查看已点亮的星区、课程进度和已获得头衔。</p>
          </div>
          <Button type="default" onClick={openAchievements}><span className="button-label-with-icon">查看成就详情 <ArrowRightIcon size={18} aria-hidden="true" /></span></Button>
        </section>

        <section className="settings-section" aria-labelledby="settings-progress-heading">
          <h3 id="settings-progress-heading">学习进度设置</h3>
          <p>选择接下来要开始的位置，适合已经学过前面课程的同学。</p>
          <form className="learning-start-form" onSubmit={applyLearningStart}>
            <div className="learning-start-fields">
              <label>
                <span id="learning-start-grade-label">年级</span>
                <Select aria-labelledby="learning-start-grade-label" options={gradeSelectOptions} value={grade} onChange={(value) => {
                  const nextGrade = Number(value);
                  const nextPosition = positions.find((position) => position.grade === nextGrade);
                  if (!nextPosition) return;
                  setGrade(String(nextGrade));
                  setTerm(String(nextPosition.term));
                  setUnit(String(nextPosition.unit));
                }} />
              </label>
              <label>
                <span id="learning-start-term-label">学期</span>
                <Select aria-labelledby="learning-start-term-label" options={termSelectOptions} value={term} onChange={(value) => {
                  const nextTerm = Number(value);
                  const nextPosition = positions.find((position) => position.grade === Number(grade) && position.term === nextTerm);
                  if (!nextPosition) return;
                  setTerm(String(nextTerm));
                  setUnit(String(nextPosition.unit));
                }} />
              </label>
              <label>
                <span id="learning-start-unit-label">从第几单元开始</span>
                <Select aria-labelledby="learning-start-unit-label" options={unitSelectOptions} value={unit} onChange={setUnit} disabled={!unitOptions.length} />
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
      <ProjectLegalFooter placement="dialog" />
    </Modal>
  );
}
