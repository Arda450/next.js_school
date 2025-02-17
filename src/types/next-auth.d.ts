import "next-auth";
import "@auth/core/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: User;
  }

  interface User {
    id: string;
    username: string;
    email: string;
    profile_image?: string;
    token: string; // Access Token
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    email?: string;
    profile_image?: string;
    accessToken: string;
  }
}
