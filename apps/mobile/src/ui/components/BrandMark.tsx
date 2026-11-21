type Props = { size?: number; tone?: 'cream' | 'ink' };

export function BrandMark({ size = 42, tone = 'cream' }: Props) {
  return (
    <span className={`brand-mark brand-mark-${tone}`} style={{ width: size, height: size }} aria-label="Símbolo de Control de Caja" role="img">
      <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
        <path d="M14 8.5h36a5.5 5.5 0 0 1 5.5 5.5v36a5.5 5.5 0 0 1-5.5 5.5H14A5.5 5.5 0 0 1 8.5 50V14A5.5 5.5 0 0 1 14 8.5Z" className="brand-mark-bill" />
        <path d="M42 19.5c-4-4.4-9-6.6-14.7-6.6-10.1 0-17.1 7.1-17.1 17.1s7 17.1 17.1 17.1c5.7 0 10.7-2.2 14.7-6.6" className="brand-mark-main" />
        <path d="M25 40.5c3.1-3.3 6.8-4.9 10.8-4.9 6.6 0 11.2 4.1 11.2 10.1 0 5.8-4.5 9.8-10.8 9.8-3.8 0-7.1-1.2-9.9-3.7" className="brand-mark-small" />
        <path d="M15 17.5h3M46 48.5h3" className="brand-mark-detail" />
      </svg>
    </span>
  );
}