"use server";

// Läuft servereitig. Steuert das Login und die Registrierung
// Diese Actions interagieren mit next-auth, um den Anmeldevorgang sicher durchzuführen und
// ggf. Token zu erstellen und zu speichern.

import { signIn, signOut } from "@/auth";
import { signInSchema, signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  try {
    /** Dadurch wird vermieden, dass next-auth versucht, einen Redirect automatisch durchzuführen.
     * Du kannst anschließend den Redirect manuell steuern.
     */
    await signOut({ redirect: false });
    return {
      status: "success",
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout failed", error);
    return {
      status: "error",
      error: "Logout failed",
    };
  }
};

export const login = async (
  prevState: any,
  formData: FormData
): Promise<any> => {
  const result = signInSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      status: "error",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Wenn der Login erfolgreich ist, den Benutzer anmelden
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    revalidatePath("/"); // Seite neu laden
    // wenn "success" wird es im useActionState gespeichert und im useEffect ausgeführt (login-form.tsx)
    return { status: "success" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        case "CallbackRouteError":
          return { status: "error", error: "Server connection failed" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    }
    return { status: "error", error: "An unexpected error occurred" };
  }
};

// ###################################################################

export const register = async (prevState: any, formData: FormData) => {
  // if (!formData) {
  //   return { status: "error", error: "No data provided" };
  // }
  // fetch the backend here
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
  console.log("register triggered");
  console.log("formData");
  // Statt FormData in ein Array umzuwandeln, mache dies direkt im Frontend.
  const formDataObject = Object.fromEntries(formData);

  // Validierung der Formulardaten
  const result = signUpSchema.safeParse(formDataObject);

  if (!result.success) {
    return {
      status: "error",
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Sende Registrierungsanfrage an das Backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Hier würdest du den Benutzer im Backend registrieren
        // Hier sendest du das JSON-Objekt
        body: JSON.stringify(formDataObject),
      }
    );

    const data = await response.json();

    if (response.status === 201) {
      return {
        status: "success",
        message: "Registration successful. Please login.",
      };
    }

    switch (response.status) {
      case 400:
        return {
          status: "error",
          error: data.message || "Invalid input data.",
        };
      case 409:
        return {
          status: "error",
          error: data.message || "User with the provided email already exists.",
        };
      case 422:
        console.log(data);
        return { status: "error", errors: data.errors };
      default: // 500er Codes etc. werden hier angezeigt
        return {
          status: "error",
          error: "Internal server error. Please try again later.",
        };
    }
  } catch (error) {
    console.error("Catch Block Error:", error);
    return {
      status: "error",
      error: "An unexpected error occurred.",
    };
  }
};
