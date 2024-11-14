"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";
import { FormInput } from "./form-input";
import { Button } from "../ui/button";
import { FormContext } from "@/types/enums/form-context";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/lib/zod";

interface LoginFormProps {
  setFormContext: (context: FormContext) => void;
}

export const LoginForm = ({ setFormContext }: LoginFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const { errors } = form.formState;

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    // we define here, that we will use next-auth's handleLogin
    // the handleLogin function of next-auth is called signIn()
    const result = await signIn("credentials", {
      redirect: false, // prevents the automatic redirect
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      toast.error(result.error, { position: "bottom-center" });
    } else {
      toast.success("Login successful", { position: "bottom-center" });
      router.push("/authenticated/todos");
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
          <Button type="submit" size="lg">
            Login
          </Button>
        </form>
      </Form>
      <p className="mt-4 self-end">
        Need an account?
        <span
          onClick={() => setFormContext(FormContext.REGISTER)}
          className="font-semibold ml-2 cursor-pointer"
        >
          Register now
        </span>
      </p>
    </div>
  );
};
