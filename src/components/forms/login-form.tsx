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
import { useRouter } from "next/navigation";

interface LoginFormProps {
  setFormContext: (context: FormContext) => void;
}

export default function LoginForm({ setFormContext }: LoginFormProps) {
  // useActionState gibt ein Array zurück, das den state und eine Funktion (loginAction) enthält, um die Aktion auszuführen
  // state speichert die aktuelle Phase der Aktion (loading, success, error) und eventuelle Fehler
  // useActionState ruft die Login Funktion vom auth-actions.ts auf und aktualisiert den state
  const [state, loginAction] = useActionState(login, undefined);

  // useEffect überwacht den state und führt die entsprechenden Aktionen aus
  useEffect(() => {
    // Für Toast und Weiterleitung nach erfolgreichem Login
    if (state?.status === "success") {
      toast.success("You are logged in! Welcome back!");
      window.location.href = "/protected";
    }
    // Für Toast bei Login-Fehlern
    if (state?.status === "error") {
      console.error("Login error:", state.error); // Debug-Logging
      toast.error(state.error || "Login failed, please check your credentials");
    }
  }, [state]);

  // handleLogin ist die Funktion, die aufgerufen wird, wenn das Formular abgeschickt wird
  // Übergibt die FormData an die loginAction
  const handleLogin = (formData: FormData) => {
    loginAction(formData);
  };

  return (
    <form className="flex flex-col gap-2" action={handleLogin}>
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
          autoComplete="email"
          autoFocus
          id="email"
          name="email"
          type="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          className={
            state?.errors?.password ? "outline outline-red-500 outline-1" : ""
          }
          autoComplete="password"
          id="password"
          type="password"
          name="password"
        />
      </div>
      {/*This is the function down below in the code*/}
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
