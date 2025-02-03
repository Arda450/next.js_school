"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useUser } from "../../user/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_STYLES, AvatarStyle, generateAvatarUrl } from "@/lib/avatar";
import { useUser } from "@/components/user/user-context";

export default function AvatarForm() {
  const { data: session, update } = useSession();
  const { refreshAvatar } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(
    AVATAR_STYLES[0]
  );
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    session?.user?.profile_image || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewAvatar) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_image: previewAvatar }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          profile_image: previewAvatar,
        },
      });
      refreshAvatar(); // Aktualisiere den Avatar im Context
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStyleChange = (style: AvatarStyle) => {
    if (session?.user?.username) {
      setSelectedStyle(style);
      const newAvatarUrl = generateAvatarUrl(style, session.user.username);
      setPreviewAvatar(newAvatarUrl);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              {previewAvatar !== session?.user?.profile_image
                ? "Preview Avatar"
                : "Your Current Avatar"}
            </p>
            <Avatar className="h-24 w-24">
              {previewAvatar ? (
                <AvatarImage
                  src={previewAvatar}
                  alt={`${session?.user?.username}'s avatar`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback>
                  {session?.user?.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <div className="w-full space-y-2">
            <label className="block text-sm font-medium">Avatar Style</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedStyle}
              onChange={(e) => handleStyleChange(e.target.value as AvatarStyle)}
            >
              {AVATAR_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={
            isLoading ||
            !previewAvatar ||
            previewAvatar === session?.user?.profile_image
          }
          className="w-full"
        >
          {isLoading ? "Updating..." : "Update Avatar"}
        </Button>
      </form>
    </Card>
  );
}
