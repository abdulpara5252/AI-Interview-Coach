"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  durationSeconds: number;
  onExpire?: () => void;
  isActive: boolean;
  className?: string;
}

export function SessionTimer({
  durationSeconds,
  onExpire,
  isActive,
  className,
}: SessionTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (!isActive || remaining <= 0) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          onExpire?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isActive, remaining, onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const isLow = remaining > 0 && remaining < 120;

  return (
    <div
      className={cn(
        "font-mono text-lg tabular-nums text-gray-900 font-semibold",
        isLow && "text-red-500",
        className
      )}
    >
      {m}:{s.toString().padStart(2, "0")}
    </div>
  );
}
