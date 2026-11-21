import type { ReactNode } from 'react';
import { UserAvatar } from './UserAvatar';

type Props = { title: string; eyebrow: string; user?: { name: string; role: string; avatarColor: string }; action?: ReactNode };

export function AppHeader({ title, eyebrow, user, action }: Props) {
  const today = new Intl.DateTimeFormat('es-CU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Havana' }).format(new Date());
  return <header className="topbar">
    <div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1></div>
    <div className="topbar-right">
      <div className="date-chip">{today}</div>
      {action}
      {user && <div className="user-chip"><UserAvatar name={user.name} color={user.avatarColor} /><div className="user-chip-copy"><div className="user-chip-name">{user.name}</div><div className="user-chip-role">{user.role}</div></div></div>}
    </div>
  </header>;
}