import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet';
  block?: boolean;
  children: ReactNode;
};

export function AppButton({ variant = 'primary', block = false, className = '', children, ...props }: Props) {
  return <button className={`btn btn-${variant} ${block ? 'btn-block' : ''} ${className}`} {...props}>{children}</button>;
}