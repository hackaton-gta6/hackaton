import { AppButton } from './AppButton';
import { Card } from './Card';

type Props = { title: string; description: string; confirmLabel?: string; onConfirm: () => void; onCancel: () => void; busy?: boolean };

export function ConfirmDialog({ title, description, confirmLabel = 'Confirmar', onConfirm, onCancel, busy = false }: Props) {
  return <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }} style={{ position: 'fixed', inset: 0, zIndex: 20, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(17,17,17,.42)', backdropFilter: 'blur(7px)' }}>
    <Card role="dialog" aria-modal="true" aria-labelledby="confirm-title" style={{ width: 'min(420px,100%)' }}>
      <div className="card-kicker">Revisión final</div><h2 id="confirm-title" className="section-title" style={{ fontSize: 22, margin: '10px 0' }}>{title}</h2><p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.65, margin: '0 0 22px' }}>{description}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><AppButton variant="secondary" onClick={onCancel} disabled={busy}>Volver</AppButton><AppButton onClick={onConfirm} disabled={busy}>{busy ? 'Guardando…' : confirmLabel}</AppButton></div>
    </Card>
  </div>;
}