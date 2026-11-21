import type { ReactNode } from 'react';

type Props = { title: string; eyebrow?: string; user?: { name: string; role: string; avatarColor: string }; action?: ReactNode };

export function AppHeader({ title, action }: Props) {
  return <header className="topbar topbar-simple">
    <h1 className="page-title">{title}</h1>
    {action && <div className="topbar-right">{action}</div>}
  </header>;
}
