"use client";

import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

type CancelButtonProps = {
  text?: string;
  onClick: () => void;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  showIcon?: boolean;
};

export default function CancelButton({
  text = "Cancel",
  onClick,
  className = "",
  variant = "outline",
  showIcon = false,
}: CancelButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      type="button"
      className={className}
    >
      {showIcon && <Ban className="h-4 w-4 mr-2" />}
      {text}
    </Button>
  );
}
