import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

type Variant = 'default' | 'primary' | 'secondary' | 'warning' | 'ghost';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: Variant;
}

export function Input({ variant = 'default', className, ...rest }: InputProps) {
    const base = 'mr-2 px-3 py-1 border rounded';

    const variantClasses: Record<Variant, string> = {
        default: 'text-secondary border border-secondary ring-0',
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-gray-900 hover:opacity-95',
        warning: 'bg-warning text-white hover:brightness-95',
        ghost: 'bg-transparent border border-gray-300 text-primary hover:bg-primary/10'
    };

    const classNames = clsx(base, variantClasses[variant], className);

    return <input
        className={classNames}
        {...rest}
    />
}

export default Input;