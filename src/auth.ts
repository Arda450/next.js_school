import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // secret: process.env.AUTH_SECRET,
  // session: {
  //   strategy: "jwt" as any, // Verwenden von `any` für den Session-Strategietyp
  // },
  pages: {
    signIn: "/auth/sign-in", // benutzerdefinierte Anmeldeseite
  },
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
            `${process.env.BACKEND_URL}/api/auth/login`,
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

          const user = await response.json();

          if (response.ok && user) {
            return {
              id: user.id,
              username: user.username,
              role: user.role,
              token: user.token, // Access Token
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
    async jwt({ token, user }: any) {
      if (user) {
        // Das accessToken wird in das JWT-Token aufgenommen
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Das accessToken wird der Sitzung hinzugefügt
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
