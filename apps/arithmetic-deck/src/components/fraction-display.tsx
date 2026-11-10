"use client";

import { Fraction } from "@/lib/types";
import { cn } from "@/lib/utils";

type FractionDisplayProps = {
  fraction: Fraction;
  showMixed?: boolean;
  className?: string;
  colorClass?: string;
  size?: "sm" | "md" | "lg" | "xl" | "pill";
};

export function FractionDisplay({
  fraction,
  showMixed = false,
  className,
  colorClass = "text-white",
  size = "md",
}: FractionDisplayProps) {
  const sizeClasses = {
    sm: "text-lg sm:text-xl",
    pill: "text-2xl sm:text-xl [@media(max-height:640px)]:text-lg",
    md: "text-2xl sm:text-4xl",
    lg: "text-4xl sm:text-6xl md:text-7xl [@media(max-height:640px)]:text-4xl [@media(orientation:landscape)_and_(max-height:640px)]:text-5xl [@media(max-height:640px)]:sm:text-5xl",
    xl: "text-5xl sm:text-7xl md:text-8xl [@media(max-height:640px)]:text-5xl [@media(orientation:landscape)_and_(max-height:640px)]:text-6xl [@media(max-height:640px)]:sm:text-6xl",
  };

  const wholeSizeClasses = {
    sm: "text-xl sm:text-2xl",
    pill: "text-2xl sm:text-2xl [@media(max-height:640px)]:text-xl",
    md: "text-3xl sm:text-5xl",
    lg: "text-5xl sm:text-7xl md:text-8xl [@media(max-height:640px)]:text-5xl [@media(orientation:landscape)_and_(max-height:640px)]:text-6xl [@media(max-height:640px)]:sm:text-6xl",
    xl: "text-6xl sm:text-8xl md:text-9xl [@media(max-height:640px)]:text-6xl [@media(orientation:landscape)_and_(max-height:640px)]:text-7xl [@media(max-height:640px)]:sm:text-7xl",
  };

  if (fraction.d === 1) {
    return (
      <span
        className={cn(
          "font-headline font-bold leading-none inline-block select-none [text-shadow:3px_3px_6px_rgba(0,0,0,0.2)]",
          colorClass,
          sizeClasses[size],
          className
        )}
      >
        {fraction.n}
      </span>
    );
  }

  if (showMixed && Math.abs(fraction.n) > fraction.d) {
    const whole = Math.trunc(fraction.n / fraction.d);
    const remN = Math.abs(fraction.n % fraction.d);

    if (remN === 0) {
      return (
        <span
          className={cn(
            "font-headline font-bold leading-none inline-block select-none [text-shadow:3px_3px_6px_rgba(0,0,0,0.2)]",
            colorClass,
            wholeSizeClasses[size],
            className
          )}
        >
          {whole}
        </span>
      );
    }

    return (
      <div
        className={cn(
          "inline-flex items-center justify-center align-middle gap-1 sm:gap-1.5 px-1 select-none",
          colorClass,
          className
        )}
      >
        <span
          className={cn(
            "font-headline font-bold leading-none [text-shadow:3px_3px_6px_rgba(0,0,0,0.2)]",
            wholeSizeClasses[size]
          )}
        >
          {whole}
        </span>
        <div
          className={cn(
            "inline-flex flex-col items-center justify-center font-headline font-bold leading-none [text-shadow:3px_3px_6px_rgba(0,0,0,0.2)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
            sizeClasses[size]
          )}
        >
          <span className="pb-0.5 border-b-2 sm:border-b-4 border-current leading-none text-center">
            {remN}
          </span>
          <span className="pt-0.5 leading-none text-center">
            {fraction.d}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center font-headline font-bold leading-none align-middle px-1 select-none [text-shadow:3px_3px_6px_rgba(0,0,0,0.2)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      <span className="pb-0.5 border-b-2 sm:border-b-4 border-current leading-none text-center">
        {fraction.n}
      </span>
      <span className="pt-0.5 leading-none text-center">
        {fraction.d}
      </span>
    </div>
  );
}
