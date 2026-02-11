export function Avatar({ initials }: { initials: string }) {
  return <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold">{initials}</div>;
}
