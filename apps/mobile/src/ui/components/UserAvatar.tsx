type Props = { name: string; color?: string; size?: 'small' | 'medium' | 'large' };

export function UserAvatar({ name, color = '#D9541E', size = 'medium' }: Props) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const dimensions = size === 'small' ? 30 : size === 'large' ? 54 : 38;
  return <span aria-label={name} style={{ width: dimensions, height: dimensions, minWidth: dimensions, borderRadius: 13, display: 'grid', placeItems: 'center', color: '#fff', background: color, fontSize: size === 'small' ? 10 : 12, fontWeight: 850, letterSpacing: '-.04em', boxShadow: '3px 4px 8px rgba(17,17,17,.12)' }}>{initials}</span>;
}