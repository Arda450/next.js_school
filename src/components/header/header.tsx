"use client";

import { logout } from "@/actions/auth-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Die zentrale Logout-Funktion mit Umleitung
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-b border-black w-full h-20 px-16 flex items-center justify-between">
      <Link href={"/"}>Logo</Link>
      <div className="flex items-center gap-6">
        <Link href={"/profile"}>Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};
