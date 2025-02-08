"use client";

import { Footer } from "@/components/footer/footer";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";

// Erlaubt das Hinzufügen und Verwalten eines lokalen Zustands in funktionalen Komponenten.
import { useState } from "react";
import Image from "next/image";

export default function LandingPage() {
  const { data: session } = useSession();
  console.log(session);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full text-center">
          <div className="w-20 h-20 sm:w-32 sm:h-32 mx-auto my-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Image
              src="/images/icon.svg"
              alt="Todo Stream Logo"
              width={128}
              height={128}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-primary">
            Todo Stream
          </h1>

          <p className=" text-lg sm:text-xl text-muted-foreground mb-4">
            Your convenient Todo App
          </p>
        </div>

        <div className="w-full max-w-[500px] bg-card p-4 rounded-lg shadow-lg">
          <h2 className="text-lg sm:text-2xl font-bold mb-4 flex justify-center">
            {activeTab === "login" ? "Log In" : "Sign Up"}
          </h2>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "login" | "register")
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm onLoginClick={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  );
}
