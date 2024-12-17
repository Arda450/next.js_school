// // Läuft auf der Client Seite
"use client";

import { register } from "@/actions/auth-actions";
import { FormContext } from "@/types/enums/form-context";

// import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
// import { useFormState, useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

interface RegisterFormProps {
  setFormContext: (context: FormContext) => void;
}

export default function RegisterForm({ setFormContext }: RegisterFormProps) {
  const [state, registerAction] = useActionState(register, undefined);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Registration successful! Please log in.");
      setFormContext(FormContext.LOGIN);
    }
    if (state?.status === "error") {
      toast.error(state.error || "Registration failed");
    }
  }, [state, setFormContext]);

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
        <Input
          className={`${
            state?.errors?.password ? " outline outline-red-500 outline-1" : ""
          }`}
          id="password"
          type="password"
          name="password"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          className={`${
            state?.errors?.password_confirmation
              ? " outline outline-red-500 outline-1"
              : ""
          }`}
          id="confirmPassword"
          type="password"
          name="password_confirmation"
        />
      </div>
      <SubmitButton />

      <p className="mt-4 self-end">
        Already have an account?
        <span
          onClick={() => setFormContext(FormContext.LOGIN)}
          className="font-semibold ml-2 cursor-pointer"
        >
          Login now
        </span>
      </p>
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
