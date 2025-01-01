"use client";

import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import { FormContext } from "@/types/enums/form-context";
import { useSession } from "next-auth/react";

// Erlaubt das Hinzufügen und Verwalten eines lokalen Zustands in funktionalen Komponenten.
import { useState } from "react";

export default function LandingPage() {
  const { data: session } = useSession();
  console.log(session);
  const [formContext, setFormContext] = useState<FormContext>(
    FormContext.LOGIN
  );

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-[600px] flex flex-col">
        <h1 className="text-2xl font-bold mb-6 flex justify-center">
          {formContext === FormContext.LOGIN
            ? "Welcome back!"
            : "Create your account"}
        </h1>
        {formContext === FormContext.LOGIN && (
          <LoginForm setFormContext={setFormContext} />
        )}
        {formContext === FormContext.REGISTER && (
          <RegisterForm setFormContext={setFormContext} />
        )}
      </div>
    </div>
  );
}
