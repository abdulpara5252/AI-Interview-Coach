"use client";
import { useState } from "react";

export function Tabs({
  tabs,
  defaultValue
}: {
  tabs: { value: string; label: string; content: React.ReactNode }[];
  defaultValue: string;
}) {
  const [active, setActive] = useState(defaultValue);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`rounded-md px-3 py-1 text-sm ${active === tab.value ? "bg-primary text-white" : "bg-muted"}`}
            onClick={() => setActive(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((t) => t.value === active)?.content}</div>
    </div>
  );
}
