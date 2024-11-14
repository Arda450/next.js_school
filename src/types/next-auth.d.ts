import "next-auth";
import "@auth/core/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }

  interface User {
    email: string;
    username: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken: string;
  }
}
