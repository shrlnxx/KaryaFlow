import React from "react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function BentoCard({ children, className = "", noPadding = false }: BentoCardProps) {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-xl shadow-subtle transition-all duration-150 min-w-0 w-full ${
        noPadding ? "" : "p-3.5 sm:p-5"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface BentoHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function BentoHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}: BentoHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F1F3F5] ${className}`}
    >
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold tracking-tight text-[#171717]">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-[#737373] leading-normal">{subtitle}</p>}
      </div>
      {action && <div className="self-start sm:self-auto shrink-0">{action}</div>}
    </div>
  );
}
