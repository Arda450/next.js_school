// Server Component (kein "use client")
import { auth } from "@/auth";
import TodoList from "./todo-list";

// Daten-Fetching Logik
async function getTodos(session: any) {
  if (!session?.accessToken) {
    return {
      status: "error",
      todos: [],
      message: "Nicht authentifiziert",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Todos");
    }

    const data = await response.json();
    return {
      status: "success",
      todos: data.todos || [],
      message: "",
    };
  } catch (error) {
    console.error("Fehler:", error);
    return {
      status: "error",
      todos: [],
      message: "Ein unerwarteter Fehler ist aufgetreten",
    };
  }
}

// Container Komponente
export default async function TodoListContainer() {
  const session = await auth();
  const { status, todos, message } = await getTodos(session);

  if (status === "error") {
    return <div className="text-red-500 font-semibold">{message}</div>;
  }

  // Übergabe der Daten an die Client Component
  return <TodoList todos={todos} session={session} />;
}
