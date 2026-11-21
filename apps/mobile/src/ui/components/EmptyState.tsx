type Props = { icon?: string; title: string; description: string };

export function EmptyState({ icon = '✳', title, description }: Props) {
  return <div className="empty-state"><div className="empty-icon">{icon}</div><div className="empty-title">{title}</div><p className="empty-copy">{description}</p></div>;
}