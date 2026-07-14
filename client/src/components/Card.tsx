import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  bordered = false,
  className = '',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`bg-brandcard shadow-premium rounded-3xl ${paddings[padding]} ${
        bordered ? 'border border-primary/10' : ''
      } transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
