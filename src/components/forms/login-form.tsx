"use client";
import HideShowInput from "@/components/ui/input-hide-show";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { login } from "@/actions/auth-actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginForm() {
  // useActionState gibt ein Array zurück, das den state und eine Funktion (loginAction) enthält, um die Aktion auszuführen
  // state speichert die aktuelle Phase der Aktion (loading, success, error) und eventuelle Fehler
  // useActionState ruft die Login Funktion vom auth-actions.ts auf und aktualisiert den state
  const [state, loginAction] = useActionState(login, {
    status: null,
    error: null,
    errors: {},
  });

  // useEffect überwacht den state und führt die entsprechenden Aktionen aus
  useEffect(() => {
    if (state?.status === "success") {
      toast.success("You are logged in!");
      window.location.href = "/protected";
    }
    // Für Toast bei Login-Fehlern
    if (state?.status === "error" && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const hasFieldErrors = state?.errors && Object.keys(state.errors).length > 0;
  const showErrorBorder = (fieldName: string) =>
    hasFieldErrors && state?.errors?.[fieldName]
      ? "outline outline-red-500 outline-1"
      : "";

  return (
    <form className="flex flex-col gap-2" action={loginAction}>
      {/* Zeige "Wrong credentials" nur wenn es Validierungsfehler gibt */}
      {hasFieldErrors && (
        <div className="text-red-500 text-sm mb-2">Wrong credentials</div>
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
        <HideShowInput
          className={
            state?.errors?.password ? "outline outline-red-500 outline-1" : ""
          }
          autoComplete="current-password"
          id="password"
          name="password"
        />
      </div>
      {/*This is the function down below in the code*/}
      <SubmitButton />
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
