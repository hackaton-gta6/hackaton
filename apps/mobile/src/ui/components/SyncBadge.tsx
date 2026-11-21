import type { SyncStatus } from '@caja/domain';

const statusContent: Record<SyncStatus, { label: string; icon: string }> = {
  local: { label: 'Solo en este dispositivo', icon: '●' },
  pending: { label: 'Pendiente de sincronizar', icon: '◷' },
  syncing: { label: 'Sincronizando', icon: '↻' },
  synced: { label: 'Sincronizado', icon: '✓' },
  error: { label: 'Error temporal', icon: '!' },
  rejected: { label: 'Requiere revisión', icon: '×' },
};

export function SyncBadge({ status }: { status: SyncStatus }) {
  const content = statusContent[status];
  return <span className={`sync-badge sync-${status}`}><span aria-hidden="true">{content.icon}</span>{content.label}</span>;
}