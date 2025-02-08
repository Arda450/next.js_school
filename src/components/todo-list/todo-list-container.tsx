// Server Component, kein "use client"
import { auth } from "@/auth";
import TodoList from "./todo-list";

export default async function TodoListContainer() {
  const session = await auth();

  if (!session?.accessToken) {
    return <div className="text-red-500 font-semibold">Not authenticated</div>;
  }

  // Übergabe der Daten an die Client Component
  return <TodoList session={session} />;
}
