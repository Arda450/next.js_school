"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AVATAR_STYLES, AvatarStyle, generateAvatarUrl } from "@/lib/avatar";
import { useUser } from "@/components/user/user-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubmitButton from "@/components/buttons/submit-button";

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
    } catch {
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
    <Card className="p-8 w-full">
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
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-2 pr-4 md:grid-cols-3 lg:grid-cols-4">
                {AVATAR_STYLES.map((style) => (
                  <div
                    key={style}
                    className={`flex cursor-pointer items-center rounded-lg border p-2 transition-colors hover:bg-accent ${
                      selectedStyle === style ? "border-primary bg-accent" : ""
                    }`}
                    onClick={() => handleStyleChange(style)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={generateAvatarUrl(
                            style,
                            session?.user?.username || "preview"
                          )}
                          alt={style}
                        />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <SubmitButton
          text="Update Avatar"
          disabled={
            isLoading ||
            !previewAvatar ||
            previewAvatar === session?.user?.profile_image
          }
          className="w-full"
        />
      </form>
    </Card>
  );
}
