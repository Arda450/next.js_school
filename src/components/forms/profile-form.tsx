"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "../user/UserContext";

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const { setUser } = useUser(); // UserContext hinzufügen
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: session?.user?.username || "",
    email: session?.user?.email || "",
    currentPassword: "",
    password: "",
    password_confirmation: "",
    profile_image: null as File | null,
  });

  // Formular wird gesendet mit "update"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FormData wird erstellt
      const formDataToSend = new FormData();
      let hasChanges = false;

      // Debug-Logging hinzufügen
      console.log("Submitting form with data:", {
        username: formData.username,
      });

      // Immer die Daten senden, unabhängig von Änderungen
      if (formData.username !== session?.user?.username) {
        formDataToSend.append("username", formData.username);
        hasChanges = true;
      }

      if (formData.email !== session?.user?.email) {
        formDataToSend.append("email", formData.email);
        hasChanges = true;
      }

      if (
        formData.password &&
        formData.currentPassword &&
        formData.password_confirmation
      ) {
        console.log("Sending password update:", {
          current_password: formData.currentPassword,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        });

        formDataToSend.append("current_password", formData.currentPassword);
        formDataToSend.append("password", formData.password);
        formDataToSend.append(
          "password_confirmation",
          formData.password_confirmation
        );
        hasChanges = true;
      }

      if (formData.profile_image) {
        formDataToSend.append("profile_image", formData.profile_image);
        hasChanges = true;
      }

      // Nur API-Aufruf machen, wenn es Änderungen gibt
      if (!hasChanges) {
        toast.info("No changes to update");
        setIsLoading(false);
        return;
      }

      // Debug-Logging
      console.log(
        "Sending update with data:",
        Object.fromEntries(formDataToSend.entries())
      );

      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully");
        setUser(responseData.user); // Aktualisiere UserContext
      } else {
        throw new Error(responseData.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error(error.message || "An unexpected error occurred");
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
              id="current_password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password">New Password</label>
            <Input
              id="password"
              type="password"
              // name="password_confirmation"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password_confirmation">Confirm New Password</label>
            <Input
              id="password_confirmation"
              type="password"
              // name="password_confirmation"
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
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
