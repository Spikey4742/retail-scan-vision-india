
import React from 'react';
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/types";

const Button = ({ children, onClick, type = "primary", disabled = false, className = "", icon }: ButtonProps) => {
  const buttonClasses = cn(
    "flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all focus:outline-none",
    {
      "bg-retailVision-primary text-white hover:bg-opacity-90": type === "primary",
      "bg-retailVision-secondary text-white hover:bg-opacity-90": type === "secondary",
      "border-2 border-retailVision-primary text-retailVision-primary hover:bg-retailVision-light": type === "outline",
      "opacity-50 cursor-not-allowed": disabled
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
