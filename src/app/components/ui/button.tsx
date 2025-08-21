import * as React from "react";

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}) {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition";
  const variants = {
    primary: "bg-white text-black hover:opacity-90",
    secondary: "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700",
  };
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4" };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
