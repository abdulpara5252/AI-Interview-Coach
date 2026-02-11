"use client";
import { useState } from "react";

export function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.title} className="rounded-lg border p-4">
          <button className="w-full text-left font-medium" onClick={() => setOpen(open === idx ? null : idx)}>
            {item.title}
          </button>
          {open === idx ? <div className="mt-2 text-sm text-muted-foreground">{item.content}</div> : null}
        </div>
      ))}
    </div>
  );
}
