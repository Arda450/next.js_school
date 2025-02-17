import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

// hier wird der Token aus dem backend nach erfolgreichem login gespeichert und in den api anfragen verwendet

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }
          console.log("Login attempt for:", credentials.email); // Debug-Logging

          // Anfrage an das Backend zur Authentifizierung
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          const data = await response.json();
          console.log("Login response:", data); // Debug-Logging

          if (!response.ok) {
            // Gib die spezifische Fehlermeldung vom Backend zurück
            throw new Error(data.message || "Authentication failed");
          }

          if (data.status === "success" && data.user) {
            return {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              profile_image: data.user.profile_image,
              token: data.user.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    authorized({
      auth,
    }: {
      request: NextRequest;
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      auth: any;
    }) {
      return !!auth; // überprüft, ob der Benutzer authentifiziert ist
    },

    // auth.ts
    async jwt({
      token,
      user,
      trigger,
    }: /* eslint-disable  @typescript-eslint/no-explicit-any */
    any) {
      if (trigger === "update") {
        // Hole die aktuellen Benutzerdaten beim Update
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          token.username = data.user.username; // Aktualisiere den Benutzernamen
          token.email = data.user.email; // Aktualisiere die E-Mail
          token.profile_image = data.user.profile_image; // Aktualisiere das Profilbild
        }
      }

      if (user) {
        token.username = user.username;
        token.email = user.email;
        token.accessToken = user.token;
        token.profile_image = user.profile_image;
      }
      return token;
    },
    async session({
      session,
      token,
    }: /* eslint-disable  @typescript-eslint/no-explicit-any */
    any) {
      session.user = {
        ...session.user,
        id: token.id,
        username: token.username,
        email: token.email,
        profile_image: token.profile_image,
      };
      session.accessToken = token.accessToken;

      return session;
    },
  },
});
