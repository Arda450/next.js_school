// import CredentialsProvider from "next-auth/providers/credentials";
// import { AuthOptions, Session, SessionStrategy, User } from "next-auth";
// import { JWT } from "next-auth/jwt";

// export const authConfig: AuthOptions = {
//   secret: process.env.AUTH_SECRET,
//   session: {
//     strategy: "jwt" as SessionStrategy, // using JWT as session strategy / management
//   },
//   pages: {
//     signIn: "/auth/sign-in", // custom sign-in page
//   },
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       // next-auth's default authorization method (no custom handleLogin)
//       // Authorize method führt eine API Anfrage an das Backend
//       // Falls erfolgreich, wird ein User-Objekt mit accessToken zurückgegeben. Das ins JWT aufgenommen wird.
//       async authorize(credentials) {
//         if (!credentials) return null;

//         // if we have credentials, we can try to login
//         // login logic is handled internally by NextAuth
//         const response = await fetch(
//           `${process.env.BACKEND_URL}/api/auth/login`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           }
//         );

//         const user = await response.json();

//         console.log(user);

//         // check if response is ok and user is exists
//         if (response.ok && user) {
//           return {
//             email: user.email,
//             accessToken: user.token,
//           } as User;
//         }

//         // if it doesn't work, return null
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     // Der jwt callback speichert das accessToken nach erfolgreicher Anmeldung im Token
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         // if user is logged in, add the token from the response to the user object
//         token.accessToken = user.accessToken;
//       }
//       return token;
//     },
//     // Im Session Callback wird das Token zum Session-Objekt hinzugefügt
//     // sodass der Token-Status auf der Client-Seite überprüfbar bleibt
//     async session({ session, token }: { session: Session; token: JWT }) {
//       // if the user is logged in and a session is created for the user,
//       // add the token from the response to the session object
//       session.accessToken = token.accessToken as string;
//       return session;
//     },
//   },
// };
