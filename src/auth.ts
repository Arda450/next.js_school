import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// hier wird der Token aus dem backend nach erfolgreichem login gespeichert und in den api anfragen verwendet

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      // name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          // Anfrage an das Backend zur Authentifizierung
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await response.json();
          const user = data.user;

          if (response.ok && data) {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              token: data.token, // Access Token
            };
          }
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }: any) {
      return !!auth; // überprüft, ob der Benutzer authentifiziert ist
    },

    // der Token wird in den JWT-Callback eingefügt. Das ermöglicht, den Token in der Middleware oder Session zu verwenden.
    async jwt({ token, user, trigger }: any) {
      //console.log("JWT Token:", token);

      if (trigger === "signIn") {
      }
      if (user) {
        token.username = user.username; // Hier der `username` zum Token
        token.email = user.email;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: any) {
      //console.log("session log: ", token);

      // Setze die gewünschten Daten in die Session
      session.user = {
        ...session.user, // Behalte bestehende Felder wie `email` oder `image`
        id: token.id,
        username: token.username,
        email: token.email,
        profileImage: token.profileImage,
      };
      session.accessToken = token.accessToken;

      return session; // Gib das Session-Objekt korrekt zurück
    },
  },
});
