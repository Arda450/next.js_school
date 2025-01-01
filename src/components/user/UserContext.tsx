"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";

interface User {
  username: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void; // Neue Funktion zum Zurücksetzen des Users
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // Sofortige Aktualisierung bei Session-Änderungen
  useEffect(() => {
    // Direkte Aktualisierung ohne zusätzliche Funktion
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user) {
      setUser(null);
      return;
    }

    setUser({
      username: session.user.username || "Guest",
      email: session.user.email || "",
      avatar: session.user.image || "/avatars/shadcn.jpg",
    });
  }, [session, status]); // Abhängigkeit von der gesamten session

  // Warte mit dem Rendering bis die Session geladen ist
  if (status === "loading") return null;

  return (
    <UserContext.Provider
      value={{ user, setUser, clearUser: () => setUser(null) }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
