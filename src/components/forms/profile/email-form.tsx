"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EmailForm() {
  const { data: session, update } = useSession();
  // const { user, setUser, refreshUser } = useUser();
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
    <Card className="p-4">
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Email"}
        </Button>
      </form>
    </Card>
  );
}
