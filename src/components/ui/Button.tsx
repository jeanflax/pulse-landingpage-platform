'use client';

import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  onClick,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full';

  const variants = {
    primary: 'text-white bg-neutral-900 hover:bg-neutral-800 transform hover:scale-105 active:scale-95',
    secondary: 'text-neutral-900 bg-white border-2 border-neutral-900 hover:bg-neutral-100',
    outline: 'text-neutral-700 bg-transparent border border-neutral-300 hover:border-neutral-900 hover:text-neutral-900',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
