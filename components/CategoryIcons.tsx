'use client';

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Saree Icon: Elegant folded saree with pallu pleats
export function SareeIcon({ className = 'h-4 w-4', size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 6c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v2H4V6z" fill="currentColor" fillOpacity="0.15" />
      <path d="M4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M4 12h16" />
      <path d="M8 8v12" />
      <path d="M12 8v12" />
      <path d="M16 8v12" />
      <path d="M6 4l4 4" strokeWidth="1.2" />
      <path d="M10 4l4 4" strokeWidth="1.2" />
    </svg>
  );
}

// 2. Bangles Icon: Two interlocking circular bangles with ornamental studs (matches flyer)
export function BangleIcon({ className = 'h-4 w-4', size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="9.5" cy="12" rx="6.5" ry="7.5" transform="rotate(-15 9.5 12)" />
      <ellipse cx="14.5" cy="12" rx="6.5" ry="7.5" transform="rotate(15 14.5 12)" fill="currentColor" fillOpacity="0.1" />
      <circle cx="9.5" cy="5.5" r="0.8" fill="currentColor" />
      <circle cx="14.5" cy="5.5" r="0.8" fill="currentColor" />
      <circle cx="6.5" cy="14" r="0.8" fill="currentColor" />
      <circle cx="17.5" cy="14" r="0.8" fill="currentColor" />
    </svg>
  );
}

// 3. Dress Icon: Elegant A-line gown / frock silhouette (matches flyer)
export function DressIcon({ className = 'h-4 w-4', size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M9 3l1.5 4h3L15 3c-1.5.8-4.5.8-6 0z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M9 3L6 8l3 2v1l-5 9a1 1 0 0 0 .9 1.5h14.2a1 1 0 0 0 .9-1.5l-5-9V10l3-2-3-5" />
      <path d="M9 11h6" />
      <path d="M12 11v9" strokeDasharray="2 2" strokeWidth="1.2" />
    </svg>
  );
}

// 4. Accessory / Jewelry Icon: Ornate necklace with gem drops (matches flyer)
export function AccessoryIcon({ className = 'h-4 w-4', size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 6c3 7 13 7 16 0" />
      <path d="M7 10c2.5 5 7.5 5 10 0" strokeWidth="1.4" />
      <circle cx="12" cy="16" r="2" fill="currentColor" />
      <path d="M12 13v1" />
      <circle cx="8.5" cy="13.5" r="1" fill="currentColor" fillOpacity="0.7" />
      <circle cx="15.5" cy="13.5" r="1" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

// 5. Gift Icon: Elegant present box with ribbon bow (matches flyer)
export function GiftIcon({ className = 'h-4 w-4', size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="8" width="18" height="4" rx="1" fill="currentColor" fillOpacity="0.15" />
      <rect x="4" y="12" width="16" height="9" rx="1" />
      <path d="M12 8v13" />
      <path d="M12 8c-1.5-2-4-2-4 0s2.5 2 4 2z" />
      <path d="M12 8c1.5-2 4-2 4 0s-2.5 2-4 2z" />
    </svg>
  );
}
