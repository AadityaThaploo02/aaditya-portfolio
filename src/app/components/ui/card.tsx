import * as React from "react";

export function Card({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl border bg-white/5 shadow-md dark:bg-zinc-900 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}
