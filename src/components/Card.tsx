import React from 'react';
import clsx from 'clsx';

export interface CardProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, actions, children, className }) => {
    return (
        <div className={clsx('text-black rounded-lg p-6 shadow-lg border border-secondary/60', className)}>
            {title && <h3 className="text-lg text-primary font-semibold mb-1">{title}</h3>}
            {subtitle && <p className="text-sm text-secondary mb-4">{subtitle}</p>}
            <div>{children}</div>
            {actions && <div className="mt-4">{actions}</div>}
        </div>
    );
};

export default Card;
