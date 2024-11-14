// // Läuft auf der Client Seite
// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { register } from "@/actions/auth-actions";
// import { useFormState, useFormStatus } from "react-dom";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { toast } from "sonner";
// import router from "next/navigation";

// export function RegisterForm() {
//   // state speichert den Formularzustand, einschließlich Fehler, während registerAction die Funktion ist, die das Formular absendet.
//   const [state, registerAction] = useFormState(register, undefined);

// };

//   return (
//     <form action={registerAction}>
//       <div>
//         <Label htmlFor="username">Username</Label>
//         <Input
//           className={`${
//             state?.errors?.username ? " outline outline-red-500 outline-1" : ""
//           }`}
//           autoFocus
//           id="username"
//           name="username"
//         />
//       </div>
//       <div>
//         <Label htmlFor="email">Email</Label>
//         <Input
//           className={`${
//             state?.errors?.email ? " outline outline-red-500 outline-1" : ""
//           }`}
//           autoFocus
//           id="email"
//           type="email"
//           name="email"
//         />
//       </div>
//       <div>
//         <Label htmlFor="password">Password</Label>
//         <Input
//           className={
//             state?.errors?.password ? "outline outline-red-500 outline-1" : ""
//           }
//           id="password"
//           type="password"
//           name="password"
//         />
//       </div>
//       <div>
//         <Label htmlFor="confirmPassword">Confirm Password</Label>
//         <Input
//           className={
//             state?.errors?.password ? "outline outline-red-500 outline-1" : ""
//           }
//           id="confirmPassword"
//           type="password"
//           name="confirmPassword"
//         />
//       </div>
//       <SubmitButton />
//     </form>
//   );
// }

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button disabled={pending} type="submit">
//       Login
//     </Button>
//   );
// }

import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormInput } from "./form-input";
import { FormContext } from "@/types/enums/form-context";
import { register } from "@/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Router importieren

interface RegisterFormProps {
  setFormContext: (context: FormContext) => void;
}

export const RegisterForm = ({ setFormContext }: RegisterFormProps) => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { errors } = form.formState;
  const router = useRouter(); // Router initialisieren

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    // Hier werden die Eingaben zur auth-actions.ts gesendet und ein neues User wird erstellt
    const response = await register(formData);

    if (response.status === "error") {
      toast.error(response.error || "Registration failed", {
        position: "bottom-center",
      });
    } else {
      toast.success("Signup successful, you can log in now", {
        position: "bottom-center",
      });
      setFormContext(FormContext.LOGIN); // Wechselt das Formular zur Login-Ansicht
    }
  }

  return (
    <div className="flex flex-col w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormInput errors={errors}>
                <Input placeholder="Username" {...field} />
              </FormInput>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormInput errors={errors}>
                <Input placeholder="Email" {...field} />
              </FormInput>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormInput errors={errors}>
                <Input type="password" placeholder="Password" {...field} />
              </FormInput>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormInput errors={errors}>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                />
              </FormInput>
            )}
          />
          <Button type="submit" size="lg">
            Register
          </Button>
        </form>
      </Form>
      <p className="mt-4 self-end">
        Already got an account?
        <span
          onClick={() => setFormContext(FormContext.LOGIN)}
          className="font-semibold ml-2 cursor-pointer"
        >
          Login now
        </span>
      </p>
    </div>
  );
};
