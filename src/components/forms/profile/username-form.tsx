"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SubmitButton from "@/components/buttons/submit-button";

export default function UsernameForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  // Setze den initialen Wert, wenn die Session geladen ist
  useEffect(() => {
    if (session?.user?.username) {
      setUsername(session.user.username);
    }
  }, [session?.user?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/user/profile/username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      // Session aktualisieren
      await update({
        ...session,
        user: {
          ...session?.user,
          username: username,
        },
      });

      toast.success("Username updated successfully");
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
          <label htmlFor="username">Your Username</label>

          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <SubmitButton
          text="Update Username"
          loadingText="Updating..."
          disabled={isLoading}
        />
      </form>
    </Card>
  );
}
