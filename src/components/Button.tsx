import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'warning' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
    const base = 'px-4 py-2 rounded font-medium transition-colors';

    const variantClasses: Record<Variant, string> = {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-gray-900 hover:opacity-95',
        warning: 'bg-warning text-white hover:brightness-95',
        ghost: 'bg-transparent border border-gray-300 text-primary hover:bg-primary/10'
    };

    const classNames = clsx(base, variantClasses[variant], className);

    return <button {...rest} className={classNames} />;
}

export default Button;