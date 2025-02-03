"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PasswordForm() {
  const { update, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.error || "Update failed");

      // Session aktualisieren
      await update({
        ...session,
        user: {
          ...session?.user,
          ...responseData.user,
        },
      });

      // Formular zurücksetzen
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      });

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="current_password">Current Password</label>
          <Input
            id="current_password"
            type="password"
            value={formData.current_password}
            onChange={(e) =>
              setFormData({ ...formData, current_password: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password">New Password</label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password_confirmation">Confirm New Password</label>
          <Input
            id="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
