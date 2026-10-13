import type { CompanionId, SubjectId } from '../../content/types';
import CompanionAvatar, { COMPANION_PROFILES } from './CompanionAvatar';

type GuideMood = 'welcome' | 'hint' | 'celebrate';

interface HeroGuideProps {
  mood: GuideMood;
  subject: SubjectId;
  companionId?: CompanionId;
  compact?: boolean;
}

const GUIDE_MESSAGES: Record<GuideMood, Record<SubjectId, string>> = {
  welcome: {
    chinese: '一起发现阅读线索吧，你的每个好奇问题都很棒！',
    math: '一起量一量、算一算，每一步思考都在积累力量！',
    english: 'Let’s explore new words together. Every curious question is a great start!',
  },
  hint: {
    chinese: '先读清题目，再找找线索；慢慢想，你一定能找到办法。',
    math: '可以先画一画、分步算；每试一步都离答案更近。',
    english: 'Look for a clue in the words. Take your time—you can figure it out!',
  },
  celebrate: {
    chinese: '这一站完成啦！你的专注和坚持点亮了新的星章。',
    math: '计算能量收集完成！你一步一步想出来了，真棒。',
    english: 'Mission complete! You found your way through those words. Great work!',
  },
};

export default function HeroGuide({ mood, subject, companionId, compact = false }: HeroGuideProps) {
  const id = companionId ?? (subject === 'math' ? 'companion-01' : 'companion-02');
  const profile = COMPANION_PROFILES[id];
  const size = compact ? 'small' : 'large';

  return (
    <div className={`hero-guide hero-guide--${mood}${compact ? ' hero-guide--compact' : ''}`}>
      <CompanionAvatar id={id} size={size} />
      <div className="hero-guide-copy">
        <span className="hero-guide-name">{profile.name} · 学习伙伴</span>
        <p>{GUIDE_MESSAGES[mood][subject]}</p>
      </div>
      {!compact && <span className="hero-guide-spark" aria-hidden="true">✧</span>}
    </div>
  );
}
