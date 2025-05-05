
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ButtonWithIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

const ButtonWithIcon = ({
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  children,
  className,
  ...props
}: ButtonWithIconProps) => {
  
  const variantClasses = {
    primary: 'bg-marketash-blue hover:bg-marketash-blue/90 text-white',
    secondary: 'bg-marketash-green hover:bg-marketash-green/90 text-white',
    outline: 'border-2 border-marketash-blue text-marketash-blue hover:bg-marketash-blue/10',
    ghost: 'hover:bg-gray-100 text-gray-800',
    default: ''
  };
  
  return (
    <Button 
      className={cn(variant !== 'default' && variantClasses[variant], 
        "flex items-center gap-2 font-medium", 
        className
      )} 
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </Button>
  );
};

export default ButtonWithIcon;
