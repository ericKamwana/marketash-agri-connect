
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ButtonWithIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
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
  
  // Map our custom variants to shadcn/ui button variants
  let mappedVariant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
  
  if (variant === 'primary') {
    // Map primary to default but with custom styling
    mappedVariant = 'default';
    className = cn("bg-marketash-blue hover:bg-marketash-blue/90 text-white", className);
  } else if (variant === 'secondary' || variant === 'outline' || variant === 'ghost' || variant === 'link' || variant === 'destructive') {
    // Pass through other valid shadcn/ui variants
    mappedVariant = variant;
  }
  
  return (
    <Button 
      variant={mappedVariant}
      className={cn("flex items-center gap-2 font-medium", className)} 
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </Button>
  );
};

export default ButtonWithIcon;
