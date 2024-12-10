import { handlers, auth } from "@/auth"; // `auth` enthält deine NextAuth-Konfiguration

export const { GET, POST } = handlers;

// Die eigentliche NextAuth-Konfiguration befindet sich in der Datei auth.ts.

// Deine api/auth/[...nextauth].ts fungiert als Vermittler, der sowohl die Routen (handlers) als auch die Konfiguration (authOptions) bereitstellt.
