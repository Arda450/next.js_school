"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SubmitButton from "@/components/buttons/submit-button";

export default function EmailForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(session?.user?.email || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile/email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      await update({
        ...session,
        user: {
          ...session?.user,
          email: email,
        },
      });
      toast.success("Email updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update username"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email">Your Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <SubmitButton
          text="Update Email"
          loadingText="Updating..."
          disabled={isLoading}
        />
      </form>
    </Card>
  );
}
