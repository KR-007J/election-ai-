import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const Button = ({ variant = "primary", className = "", children, ...props }: ButtonProps) => {
  const baseStyles = "font-body font-medium rounded-full transition-all duration-300 cursor-pointer active:scale-95";
  const variants = {
    primary: "bg-accent text-bg-deep font-bold px-8 py-3.5 hover:bg-[#00f0ff] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]",
    ghost: "bg-transparent text-text-hi border border-accent/40 px-7 py-3.5 hover:bg-accent/10 hover:border-accent hover:text-accent",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
