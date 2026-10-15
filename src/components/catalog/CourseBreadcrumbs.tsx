interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface CourseBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export default function CourseBreadcrumbs({ items, onNavigate }: CourseBreadcrumbsProps) {
  const compactItems = items.length <= 1
    ? items
    : items.length > 5
      ? items.slice(-2)
      : [items[0], items.at(-1)].filter((item): item is BreadcrumbItem => Boolean(item));

  function renderItems(itemsToRender: BreadcrumbItem[]) {
    return itemsToRender.map((item, index) => (
      <li key={`${item.label}-${index}`}>
        {index > 0 && <span aria-hidden="true" className="breadcrumb-separator">/</span>}
        {item.path && index < itemsToRender.length - 1 ? (
          <a
            href={item.path}
            onClick={(event) => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              onNavigate(item.path!);
            }}
          >
            {item.label}
          </a>
        ) : (
          <span aria-current={index === itemsToRender.length - 1 ? 'page' : undefined}>{item.label}</span>
        )}
      </li>
    ));
  }

  return (
    <nav className="course-breadcrumbs" aria-label="路径导航">
      <ol className="course-breadcrumbs-full">{renderItems(items)}</ol>
      <ol className="course-breadcrumbs-compact">{renderItems(compactItems)}</ol>
    </nav>
  );
}
