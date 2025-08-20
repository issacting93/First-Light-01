import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'terminal' | 'panel';
  padding?: 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  border = true,
}) => {
  const baseClasses = 'rounded-lg backdrop-blur-sm';
  
  const variantClasses = {
    default: 'bg-terminal-bg-panel border-terminal-border',
    terminal: 'bg-terminal-bg-secondary border-terminal-border-accent',
    panel: 'bg-terminal-bg-tertiary border-terminal-border-muted',
  };
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const borderClasses = border ? 'border' : '';
  
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    borderClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}; 