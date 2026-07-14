import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconColorTheme = 'primary' | 'secondary' | 'accent' | 'blue' | 'purple';

interface IconTileProps {
  iconName: keyof typeof LucideIcons;
  theme?: IconColorTheme;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const IconTile: React.FC<IconTileProps> = ({
  iconName,
  theme = 'primary',
  size = 'md',
  className = ''
}) => {
  const IconComponent = LucideIcons[iconName] as React.ComponentType<any>;

  if (!IconComponent) {
    return null;
  }

  const themes = {
    primary: {
      bg: 'bg-primary/15',
      icon: 'text-primary',
    },
    secondary: {
      bg: 'bg-secondary/15',
      icon: 'text-secondary-dark',
    },
    accent: {
      bg: 'bg-accent/15',
      icon: 'text-accent',
    },
    blue: {
      bg: 'bg-blue-500/15',
      icon: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-500/15',
      icon: 'text-purple-600',
    }
  };

  const sizes = {
    sm: {
      container: 'w-10 h-10 rounded-xl',
      icon: 20
    },
    md: {
      container: 'w-12 h-12 rounded-[14px]',
      icon: 24
    },
    lg: {
      container: 'w-16 h-16 rounded-2xl',
      icon: 32
    }
  };

  const currentTheme = themes[theme];
  const currentSize = sizes[size];

  return (
    <div
      className={`flex items-center justify-center shrink-0 ${currentSize.container} ${currentTheme.bg} ${className}`}
    >
      <IconComponent 
        size={currentSize.icon} 
        className={`${currentTheme.icon}`}
        strokeWidth={2.5} // bold style
      />
    </div>
  );
};
