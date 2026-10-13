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
    chinese: '一起读线索、发现新知识吧！',
    math: '一起量一量、算一算，出发吧！',
  },
  hint: {
    chinese: '先读清题目，再找找线索；慢慢想也没关系。',
    math: '可以先画一画、分步算；慢慢想也没关系。',
  },
  celebrate: {
    chinese: '这一站完成啦！新的星章已经点亮。',
    math: '计算能量收集完成！新的星章已经点亮。',
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
