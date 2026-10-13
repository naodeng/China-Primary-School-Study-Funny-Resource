import type { CompanionId } from '../../content/types';

export const COMPANION_IDS: CompanionId[] = [
  'companion-01',
  'companion-02',
  'companion-03',
  'companion-04',
];

export const COMPANION_PROFILES: Record<CompanionId, { name: string; alt: string }> = {
  'companion-01': { name: '红金号', alt: '红金号学习伙伴的圆形卡通头像' },
  'companion-02': { name: '云岛号', alt: '云岛号学习伙伴的圆形卡通头像' },
  'companion-03': { name: '星轨号', alt: '星轨号学习伙伴的圆形卡通头像' },
  'companion-04': { name: '巡星号', alt: '巡星号学习伙伴的圆形卡通头像' },
};

const COMPANION_IMAGES: Record<CompanionId, string> = {
  'companion-01': '/assets/companions/companion-01.webp',
  'companion-02': '/assets/companions/companion-02.webp',
  'companion-03': '/assets/companions/companion-03.webp',
  'companion-04': '/assets/companions/companion-04.webp',
};

interface CompanionAvatarProps {
  id: CompanionId;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function CompanionAvatar({ id, alt, size = 'medium', className = '' }: CompanionAvatarProps) {
  const profile = COMPANION_PROFILES[id];
  const classes = ['companion-avatar', `companion-avatar--${size}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <img src={COMPANION_IMAGES[id]} alt={alt ?? profile.alt} loading="lazy" decoding="async" />
      <span className="companion-avatar-spark" aria-hidden="true">✦</span>
    </span>
  );
}
