import "next-auth";
import "@auth/core/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    // new
    user: User;
  }

  interface User {
    id: string;
    username: string;
    email: string; // Hinzugefügt
    profile_image?: string; // Optionales Profilbild
    role?: string; // Rolle (falls erforderlich)
    token: string; // Access Token
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string; // Benutzer-ID
    username?: string; // Benutzername
    email?: string; // E-Mail-Adresse
    profile_image?: string; // Optionales Profilbild
    accessToken: string;
  }
}
