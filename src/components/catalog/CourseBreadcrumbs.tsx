interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface CourseBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export default function CourseBreadcrumbs({ items, onNavigate }: CourseBreadcrumbsProps) {
  return (
    <nav className="course-breadcrumbs" aria-label="路径导航">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {index > 0 && <span aria-hidden="true" className="breadcrumb-separator">/</span>}
            {item.path && index < items.length - 1 ? (
              <a
                href={item.path}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.path!);
                }}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
