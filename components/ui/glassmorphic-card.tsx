import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassmorphicCard({ children, className }: GlassmorphicCardProps) {
  return (
    <div className={cn(
      "relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl",
      // "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
      // "before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
      // "before:mask-composite-subtract before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
      "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
      "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
      className
    )}>
      {children}
    </div>
  );
}