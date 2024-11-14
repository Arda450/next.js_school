"use server";

// Läuft servereitig. Steuert das Login und die Registrierung
// Diese Actions interagieren mit next-auth, um den Anmeldevorgang sicher durchzuführen und
// ggf. Token zu erstellen und zu speichern.

import { signIn, signOut } from "@/auth";
import { signInSchema, signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const logout = async (prevState: any, formData: FormData) => {
  try {
    await signOut();
  } catch (e) {
    throw e;
  }
};

export const login = async (formData: FormData) => {
  const result = signInSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      status: "error",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Sende Login-Anfrage an das Backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { status: "error", error: data.message || "Login failed" };
    }

    // Wenn der Login erfolgreich ist, den Benutzer anmelden
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    }
    throw error;
  }

  revalidatePath("/");
};

export const register = async (formData: FormData) => {
  // fetch the backend here
  console.log(process.env.BACKEND_URL);
  console.log("register triggered");
  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      status: "error",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Sende Registrierungsanfrage an das Backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Hier würdest du den Benutzer im Backend registrieren
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    console.log(response.status);
    if (response.status !== 201) {
      return { status: "error", error: "Registration failed" };
    }
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      const data = await response.json(); // fehlerbehandlung
      return { status: "error", error: data.message || "Registration failed" };
    }

    return { status: "success", user: data };
  } catch (error) {
    console.log("in catch");
    console.log(error);
    if (error instanceof AuthError) {
      return { status: "error", error: "Failed to register" };
    }
    throw error;
  }
};
