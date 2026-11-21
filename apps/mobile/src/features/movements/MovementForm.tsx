import { useState } from 'react';
import { parseAmount, type MovementType } from '@caja/domain';
import { movementTypeLabels } from '../../i18n/movement-types';
import { FormField } from '../../ui/components/FormField';

export type MovementDraft = { type: MovementType; amountMinor: number; description: string; occurredAt: string; reference: string | null };

type Props = { type: MovementType; sessionOpenedAt: string; onContinue: (draft: MovementDraft) => void; onBack: () => void };

export function MovementForm({ type, sessionOpenedAt, onContinue, onBack }: Props) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = () => {
    const next: Record<string, string> = {};
    const parsed = parseAmount(amount);
    if (!parsed.ok) next.amountMinor = parsed.errors[0].code === 'AMOUNT_REQUIRED' ? 'Introduce el importe.' : parsed.errors[0].code === 'AMOUNT_FORMAT' ? 'Usa el formato 1.250,50.' : 'Introduce un importe válido y mayor que cero.';
    else if (parsed.value <= 0) next.amountMinor = 'El importe debe ser mayor que cero.';
    if (description.trim().length < 3) next.description = 'Escribe al menos 3 caracteres.';
    if (description.trim().length > 140) next.description = 'El máximo es de 140 caracteres.';
    const occurred = new Date(`${date}T${time}:00`);
    if (!date || !time || Number.isNaN(occurred.getTime())) next.occurredAt = 'Indica una fecha y hora válidas.';
    else if (occurred.getTime() > Date.now() + 5 * 60 * 1000) next.occurredAt = 'La fecha no puede estar en el futuro.';
    else if (occurred.getTime() < new Date(sessionOpenedAt).getTime()) next.occurredAt = 'La fecha no puede ser anterior a la apertura de la caja.';
    if (Object.keys(next).length) { setErrors(next); return; }
    onContinue({ type, amountMinor: parsed.ok ? parsed.value : 0, description: description.trim(), occurredAt: occurred.toISOString(), reference: reference.trim() || null });
  };
  return <div className="movement-form">
    <div className="selected-type-line"><span className="selected-type-mark">↗</span><span><small>Tipo seleccionado</small><strong>{movementTypeLabels[type]}</strong></span></div>
    <FormField label="Importe" htmlFor="movement-amount" error={errors.amountMinor} hint="Introduce el importe en CUP. Ejemplo: 1.250,50.">
      <div className="money-input-wrap"><span>CUP</span><input id="movement-amount" className="field money-input" inputMode="decimal" autoComplete="off" placeholder="0,00" value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
    </FormField>
    <FormField label="Descripción" htmlFor="movement-description" error={errors.description} hint={`${description.length}/140 · Describe brevemente el motivo.`}>
      <textarea id="movement-description" className="field text-field" rows={3} maxLength={160} placeholder="¿Qué ha ocurrido?" value={description} onChange={(event) => setDescription(event.target.value)} />
    </FormField>
    <div className="field-pair">
      <FormField label="Fecha" htmlFor="movement-date" error={errors.occurredAt}><input id="movement-date" className="field" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></FormField>
      <FormField label="Hora" htmlFor="movement-time"><input id="movement-time" className="field" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></FormField>
    </div>
    <FormField label="Referencia (opcional)" htmlFor="movement-reference" hint="Factura, recibo o identificador interno.">
      <input id="movement-reference" className="field" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="N.º de referencia" />
    </FormField>
    <div className="form-actions"><button className="btn btn-quiet" type="button" onClick={onBack}>← Cambiar tipo</button><button className="btn btn-primary" type="button" onClick={submit}>Revisar movimiento <span>↗</span></button></div>
  </div>;
}