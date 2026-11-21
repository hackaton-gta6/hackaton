import type { ReactNode } from 'react';

type Props = { label: string; htmlFor: string; hint?: string; error?: string; children: ReactNode };

export function FormField({ label, htmlFor, hint, error, children }: Props) {
  return <div className="form-field">
    <label className="field-label" htmlFor={htmlFor}>{label}</label>
    {children}
    {error ? <p className="form-error" role="alert">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
  </div>;
}