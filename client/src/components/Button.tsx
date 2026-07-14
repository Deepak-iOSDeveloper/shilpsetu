import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'accent';
  showArrow?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  showArrow = false,
  fullWidth = true,
  className = '',
  ...props
}) => {
  const baseStyle = "flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark rounded-xl px-6 py-4 text-base shadow-sm focus:ring-primary",
    secondary: "bg-secondary text-text-primary hover:bg-secondary-dark rounded-xl px-6 py-4 text-base focus:ring-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary-light rounded-xl px-6 py-4 text-base focus:ring-primary",
    accent: "bg-accent text-white hover:bg-accent-dark rounded-xl px-6 py-4 text-base focus:ring-accent",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl px-6 py-4 text-base focus:ring-red-500",
  };

  const widthStyle = fullWidth ? "w-full" : "px-6";

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {showArrow && <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />}
      </span>
    </button>
  );
};
