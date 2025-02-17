"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CancelButton from "@/components/buttons/cancel-button";

export default function DeleteButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!session?.user?.email) {
      toast.error("No user session found");
      return;
    }

    if (email !== session.user.email) {
      toast.error("Email does not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        // Änderung hier
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to delete user");
      }

      toast.success("Your User Profile has been deleted successfully");
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Profile
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your profile?
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-4">
            <span>
              All your data will be deleted and you will be logged out.
            </span>
            <span>
              Please enter your email address to delete your profile, if you
              want to proceed.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <CancelButton showIcon={true} onClick={() => {}} />
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              {isLoading ? "Deleting..." : "Confirm"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
