import React from 'react';

interface LogoProps {
  size?: number;
}

// Este es el logo que usa toda la app
export function LogoIcon({ size = 40 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1-icon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient>
        <linearGradient id="grad2-icon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#d946ef" /></linearGradient>
        <linearGradient id="grad3-icon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#f43f5e" /></linearGradient>
        <linearGradient id="grad4-icon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient>
      </defs>
      <line x1="100" y1="60" x2="65" y2="120" stroke="url(#grad4-icon)" strokeWidth="4" opacity="0.4" />
      <line x1="100" y1="60" x2="135" y2="120" stroke="url(#grad4-icon)" strokeWidth="4" opacity="0.4" />
      <line x1="65" y1="120" x2="135" y2="120" stroke="url(#grad4-icon)" strokeWidth="4" opacity="0.4" />
      <circle cx="100" cy="60" r="22" fill="url(#grad1-icon)" />
      <circle cx="65" cy="120" r="22" fill="url(#grad2-icon)" />
      <circle cx="135" cy="120" r="22" fill="url(#grad3-icon)" />
      <circle cx="100" cy="100" r="10" fill="url(#grad4-icon)" />
    </svg>
  );
}