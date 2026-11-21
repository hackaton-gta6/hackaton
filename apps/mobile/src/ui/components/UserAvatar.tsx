type Props = { name: string; color?: string; size?: 'small' | 'medium' | 'large' };

export function UserAvatar({ name, size = 'medium' }: Props) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const dimensions = size === 'small' ? 30 : size === 'large' ? 54 : 38;
  return <span aria-label={name} style={{ width: dimensions, height: dimensions, minWidth: dimensions, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--cream)', background: 'var(--ink)', fontSize: size === 'small' ? 10 : 12, fontWeight: 600, letterSpacing: '-.02em' }}>{initials}</span>;
}
