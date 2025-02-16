"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  text: string;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

export default function SubmitButton({
  text,
  loadingText = "Loading...",
  className = "",
  disabled = false,
  variant = "default",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending || disabled}
      type="submit"
      className={className}
      variant={variant}
    >
      {pending ? loadingText : text}
    </Button>
  );
}
