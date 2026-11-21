import type { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLElement> & { children: ReactNode; paper?: boolean };

export function Card({ children, paper = false, className = '', ...props }: Props) {
  return <section className={`panel-card ${paper ? 'paper' : ''} ${className}`} {...props}>{children}</section>;
}