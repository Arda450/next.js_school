"use client";

import { Input } from "../ui/input";
import { FormContext } from "@/types/enums/form-context";
import { useEffect } from "react";
import { login } from "@/actions/auth-actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LoginFormProps {
  setFormContext: (context: FormContext) => void;
}

export default function LoginForm({ setFormContext }: LoginFormProps) {
  const [state, loginAction] = useActionState(login, undefined);

  const handleLoginAction = (formData: FormData) => {
    toast.promise(
      async () => {
        loginAction(formData);
      },
      {
        loading: "Logging in...",
        success: "Logged in successfully!",
        error: "Failed to log in.",
      }
    );
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <form className="flex flex-col gap-2" action={handleLoginAction}>
      {state?.status === "error" && (
        <div className="flex flex-col text-red-500 text-sm">
          {state.error && <span>{state.error}</span>}
          {state.errors?.email?.map((err: string, index: number) => (
            <span key={index}>{err}</span>
          ))}
          {state.errors?.password?.map((err: string, index: number) => (
            <span key={index}>{err}</span>
          ))}
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          className={`${
            state?.errors?.email ? " outline outline-red-500 outline-1" : ""
          }`}
          autoFocus
          id="email"
          name="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          className={
            state?.errors?.password ? "outline outline-red-500 outline-1" : ""
          }
          id="password"
          type="password"
          name="password"
        />
      </div>
      <SubmitButton />
      <p className="mt-4 self-end">
        Need an account?
        <span
          onClick={() => setFormContext(FormContext.REGISTER)}
          className="font-semibold ml-2 cursor-pointer"
        >
          Register now
        </span>
      </p>
    </form>
  );
}
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      Login
    </Button>
  );
}
