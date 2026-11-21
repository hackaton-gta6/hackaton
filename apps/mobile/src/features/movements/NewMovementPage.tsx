import { useState } from 'react';
import { formatAmount, type MovementType, type Role } from '@caja/domain';
import type { MovementDraft } from './MovementForm';
import { MovementForm } from './MovementForm';
import { MovementTypePicker } from './MovementTypePicker';
import { movementTypeLabels } from '../../i18n/movement-types';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';

type Props = { user: { name: string; role: string; avatarColor: string }; role: Role; sessionOpenedAt: string; onBack: () => void; onCreate: (draft: MovementDraft) => void };

export function NewMovementPage({ user, role, sessionOpenedAt, onBack, onCreate }: Props) {
  const [type, setType] = useState<MovementType | null>(null);
  const [draft, setDraft] = useState<MovementDraft | null>(null);
  const [step, setStep] = useState(1);
  const direction = type && ['sale', 'collection', 'other_income'].includes(type) ? 'Entrada' : 'Salida';
  return <div>
    <AppHeader eyebrow="E3 · Nuevo registro" title="Registrar movimiento" user={user} action={<AppButton variant="quiet" onClick={onBack}>Cancelar</AppButton>} />
    <div className="new-movement-wrap">
      <div className="step-track"><span className={step >= 1 ? 'current' : ''}>01 <small>Tipo</small></span><i /><span className={step >= 2 ? 'current' : ''}>02 <small>Datos</small></span><i /><span className={step >= 3 ? 'current' : ''}>03 <small>Revisar</small></span></div>
      {step === 1 && <Card><div className="card-kicker">Paso 01 · Clasificación</div><h2 className="section-title" style={{ fontSize: 22, margin: '9px 0 6px' }}>¿Qué ha ocurrido?</h2><p className="section-subtitle">Elige el tipo que mejor describe el movimiento. Solo aparecen las opciones permitidas para tu perfil.</p><MovementTypePicker role={role} value={type} onChange={setType} /><div className="form-actions"><span className="section-subtitle">Los movimientos no se editan después de guardarse.</span><AppButton disabled={!type} onClick={() => setStep(2)}>Continuar ↗</AppButton></div></Card>}
      {step === 2 && type && <Card><div className="card-kicker">Paso 02 · Información</div><h2 className="section-title" style={{ fontSize: 22, margin: '9px 0 18px' }}>{direction} de efectivo</h2><MovementForm type={type} sessionOpenedAt={sessionOpenedAt} onBack={() => setStep(1)} onContinue={(next) => { setDraft(next); setStep(3); }} /></Card>}
      {step === 3 && draft && type && <Card><div className="card-kicker">Paso 03 · Confirmación</div><h2 className="section-title" style={{ fontSize: 22, margin: '9px 0 18px' }}>Comprueba los datos</h2><div className="review-amount"><small>{direction} · CUP</small><strong>{formatAmount(draft.amountMinor)}</strong></div><div className="info-row"><span className="info-label">Tipo</span><strong className="info-value">{movementTypeLabels[type]}</strong></div><div className="info-row"><span className="info-label">Descripción</span><strong className="info-value">{draft.description}</strong></div><div className="info-row"><span className="info-label">Fecha y hora</span><strong className="info-value">{new Intl.DateTimeFormat('es-CU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(draft.occurredAt))}</strong></div>{draft.reference && <div className="info-row"><span className="info-label">Referencia</span><strong className="info-value">{draft.reference}</strong></div>}<div className="preview-note"><span>REGISTRO DE PRUEBA</span> Esta acción se añadirá a la vista local de desarrollo; todavía no escribe en el repositorio real.</div><div className="form-actions"><AppButton variant="secondary" onClick={() => setStep(2)}>← Editar</AppButton><AppButton onClick={() => onCreate(draft)}>Confirmar movimiento</AppButton></div></Card>}
    </div>
  </div>;
}