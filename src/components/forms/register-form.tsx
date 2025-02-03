// // Läuft auf der Client Seite
"use client";

import HideShowInput from "@/components/ui/input-hide-show";
import { register } from "@/actions/auth-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

interface RegisterFormProps {
  onLoginClick: () => void;
}

export default function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const [state, registerAction] = useActionState(register, undefined);

  useEffect(() => {
    if (state?.status === "success") {
      const timer = setTimeout(() => {
        toast.success("Registration successful! Please log in.");
        onLoginClick();
      }, 0);
      return () => clearTimeout(timer);
    }
    if (state?.status === "error") {
      toast.error(state.error || "Registration failed");
    }
  }, [state, onLoginClick]);

  // handleRegister ist die Funktion, die aufgerufen wird, wenn das Formular abgeschickt wird
  const handleRegister = (formData: FormData) => {
    registerAction(formData);
  };

  return (
    <form className="flex flex-col gap-2" action={handleRegister}>
      {state?.status === "error" && (
        <div className="flex flex-col text-red-500 text-sm">
          {state.errors?.username &&
            state.errors.username.map((err: string, index: number) => (
              <span key={index}>{err}</span>
            ))}
          {state.errors?.email &&
            state.errors.email.map((err: string, index: number) => (
              <span key={index}>{err}</span>
            ))}
          {state.errors?.password &&
            state.errors.password.map((err: string, index: number) => (
              <span key={index}>{err}</span>
            ))}
          {state.errors?.password_confirmation &&
            state.errors.password_confirmation.map(
              (err: string, index: number) => <span key={index}>{err}</span>
            )}
        </div>
      )}
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          className={`${
            state?.errors?.username ? " outline outline-red-500 outline-1" : ""
          }`}
          autoFocus
          id="username"
          name="username"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className={`${
            state?.errors?.email ? " outline outline-red-500 outline-1" : ""
          }`}
          id="email"
          type="email"
          name="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <HideShowInput
          className={`${
            state?.errors?.password ? " outline outline-red-500 outline-1" : ""
          }`}
          id="password"
          name="password"
          autoComplete="new-password"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <HideShowInput
          className={`${
            state?.errors?.password_confirmation
              ? " outline outline-red-500 outline-1"
              : ""
          }`}
          id="confirmPassword"
          name="password_confirmation"
          autoComplete="new-password"
        />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      Register
    </Button>
  );
}
