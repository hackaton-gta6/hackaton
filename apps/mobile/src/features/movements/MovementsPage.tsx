import { useMemo, useState } from 'react';
import { formatAmount, type CashSession, type Movement, type MovementType, type Role } from '@caja/domain';
import { movementTypeLabels } from '../../i18n/movement-types';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { EmptyState } from '../../ui/components/EmptyState';
import { MovementListItem } from './MovementListItem';
import { SessionSummaryCard } from './SessionSummaryCard';

type Filter = 'all' | 'in' | 'out';
type Props = { user: { name: string; role: string; avatarColor: string }; role: Role; session: CashSession; movements: Movement[]; incomeMinor: number; expenseMinor: number; expectedMinor: number; onAdd: () => void; onSelect: (movement: Movement) => void; readOnly?: boolean; preview: boolean };

export function MovementsPage({ user, role, session, movements, incomeMinor, expenseMinor, expectedMinor, onAdd, onSelect, readOnly = false, preview }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');
  const filtered = useMemo(() => movements.filter((movement) => {
    const matchesDirection = filter === 'all' || movement.direction === filter;
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesDirection && matchesType;
  }).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [movements, filter, typeFilter]);
  const types = Array.from(new Set(movements.map((movement) => movement.type as MovementType)));
  const grouped = filtered.reduce<Record<string, Movement[]>>((groups, movement) => {
    const day = new Intl.DateTimeFormat('es-CU', { dateStyle: 'full', timeZone: 'America/Havana' }).format(new Date(movement.occurredAt));
    (groups[day] ??= []).push(movement);
    return groups;
  }, {});
  return <div>
    <AppHeader eyebrow="E3 · Actividad de caja" title="Movimientos" user={user}  />
    {preview && <div className="preview-note"><span>Aviso</span> Los movimientos de esta versión son de prueba y todavía no se guardan.</div>}
    <div className="movement-layout">
      <div className="movement-main-column">
        <SessionSummaryCard incomeMinor={incomeMinor} expenseMinor={expenseMinor} expectedMinor={expectedMinor} />
        <Card>
          <div className="section-heading"><div><div className="card-kicker">Libro de caja</div><h2 className="section-title" style={{ marginTop: 7 }}>Actividad registrada</h2></div><span className="pill">{movements.length} movimientos</span></div>
          <div className="filter-row" aria-label="Filtrar movimientos">
            {(['all', 'in', 'out'] as Filter[]).map((item) => <button key={item} className={`filter-chip ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)}>{item === 'all' ? 'Todos' : item === 'in' ? 'Ingresos' : 'Egresos'}</button>)}
          </div>
          {types.length > 0 && <div className="type-filter-wrap"><select className="type-filter" aria-label="Filtrar por tipo" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as MovementType | 'all')}><option value="all">Todos los tipos</option>{types.map((type) => <option key={type} value={type}>{movementTypeLabels[type] ?? type}</option>)}</select></div>}
          {filtered.length === 0 ? <EmptyState icon="↗" title="Aún no hay movimientos" description="Cuando registres una entrada o salida de efectivo, aparecerá aquí con su estado y hora." /> : <div className="movement-groups">{Object.entries(grouped).map(([day, items]) => <section key={day}><div className="movement-day">{day}</div><div className="movement-list">{items.map((movement) => <MovementListItem key={movement.id} movement={movement} onClick={() => onSelect(movement)} />)}</div></section>)}</div>}
          {!readOnly && <div className="movement-add-bottom"><AppButton block onClick={onAdd}>＋ Registrar movimiento</AppButton></div>}
        </Card>
      </div>
      <aside className="movement-side-column">
        <Card paper><div className="card-kicker">Sesión activa</div><h3 className="section-title" style={{ margin: '8px 0 14px' }}>Caja en curso</h3><div className="info-row"><span className="info-label">Apertura</span><span className="info-value">{new Intl.DateTimeFormat('es-CU', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Havana' }).format(new Date(session.openedAt))}</span></div><div className="info-row"><span className="info-label">Moneda</span><span className="info-value">{session.currency}</span></div><div className="info-row"><span className="info-label">Estado</span><span className="info-value">Abierta</span></div></Card>
      </aside>
    </div>
  </div>;
}