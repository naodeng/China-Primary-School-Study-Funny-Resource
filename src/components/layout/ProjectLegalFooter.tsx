interface ProjectLegalFooterProps {
  placement?: 'page' | 'dialog';
}

export default function ProjectLegalFooter({ placement = 'page' }: ProjectLegalFooterProps) {
  return (
    <footer className={`project-legal-footer project-legal-footer--${placement}`} aria-label="版权与许可">
      <span>
        © 2026{' '}
        <a href="https://inaodeng.com" target="_blank" rel="me noopener noreferrer" aria-label="naodeng 的个人网站">
          naodeng
        </a>{' '}
        All Rights Reserved.
      </span>
      <span>
        项目自有代码与原创内容采用{' '}
        <a href="https://polyformproject.org/licenses/noncommercial/1.0.0/" target="_blank" rel="noopener noreferrer">
          PolyForm Noncommercial License 1.0.0
        </a>
        。
      </span>
    </footer>
  );
}
