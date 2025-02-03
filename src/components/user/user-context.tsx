"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

type UserContextType = {
  avatarUrl: string | null;
  refreshAvatar: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [avatarKey, setAvatarKey] = useState(Date.now());

  const avatarUrl = session?.user?.profile_image
    ? `${session.user.profile_image}?t=${avatarKey}`
    : null;

  const refreshAvatar = () => {
    setAvatarKey(Date.now());
  };

  return (
    <UserContext.Provider value={{ avatarUrl, refreshAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
