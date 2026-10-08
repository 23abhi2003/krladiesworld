'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@heroui/react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  count?: number | string;
}

export function NavCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  count,
}: NavCardProps) {
  return (
    <Card
      as={Link}
      href={href}
      isPressable
      className="group relative overflow-hidden border border-kr-gold/30 bg-white hover:border-kr-gold shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kr-maroon via-kr-gold to-kr-maroonDark opacity-80 group-hover:opacity-100 transition" />
      <CardBody className="p-4 sm:p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-kr-blush text-kr-maroon border border-kr-blushBorder group-hover:bg-kr-maroon group-hover:text-white transition-colors duration-200">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-kr-gold/20 text-kr-maroon border border-kr-gold/40">
                {badge}
              </span>
            )}
            {count !== undefined && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {count}
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-serif font-bold text-gray-900 text-base group-hover:text-kr-maroon transition-colors flex items-center justify-between">
            <span>{title}</span>
            <ArrowRight className="h-4 w-4 text-kr-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
export default NavCard;
