"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: session?.user?.username || "",
    email: session?.user?.email || "",
    password: "",
    current_password: "",
    profile_image: null as File | null,
  });

  // Formular wird gesendet mit "update"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FormData wird erstellt
      const formDataToSend = new FormData();

      // Debug-Logging hinzufügen
      console.log("Submitting form with data:", {
        username: formData.username,
      });

      // // Nur geänderte Felder werden gesendet
      // if (formData.username !== session?.user?.username) {
      //   formDataToSend.append("username", formData.username);
      // }
      // if (formData.email !== session?.user?.email) {
      //   formDataToSend.append("email", formData.email);
      // }
      // if (formData.password) {
      //   formDataToSend.append("password", formData.password);
      //   formDataToSend.append("current_password", formData.current_password);
      // }
      // if (formData.profile_image) {
      //   formDataToSend.append("profile_image", formData.profile_image);
      // }

      // Immer die Daten senden, unabhängig von Änderungen
      if (formData.username !== session?.user?.username) {
        formDataToSend.append("username", formData.username);
      }

      if (formData.email !== session?.user?.email) {
        formDataToSend.append("email", formData.email);
      }

      if (formData.password) {
        formDataToSend.append("password", formData.password);
        formDataToSend.append("current_password", formData.current_password);
      }

      if (formData.profile_image) {
        formDataToSend.append("profile_image", formData.profile_image);
      }

      // Debug-Logging
      console.log(
        "FormData entries:",
        Object.fromEntries(formDataToSend.entries())
      );

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      const data = await response.json();
      console.log("Response data:", data);

      await update(); // Session aktualisieren
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setFormData({ ...formData, profile_image: file });
            }}
          />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="current_password">Current Password</label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.current_password}
              onChange={(e) =>
                setFormData({ ...formData, current_password: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="confirmPassword">New Password</label>
            <Input
              id="confirmPassword"
              type="password"
              name="password_confirmation"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Card>
  );
}
