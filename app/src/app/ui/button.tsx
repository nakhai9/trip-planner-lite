import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`box-border bg-warning hover:bg-warning-strong shadow-xs px-4 py-2.5 border border-transparent rounded-base focus:outline-none focus:ring-4 focus:ring-warning-medium font-medium text-white text-sm leading-5 ${className}`}
    >
      {children ?? "Warning"}
    </button>
  );
}
