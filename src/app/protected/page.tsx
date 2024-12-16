// Ohne "use client". Dies ist eine Server-Komponente
import AddTodoForm from "@/components/forms/add-todo-form";
import { auth } from "@/auth";
import TodoListContainer from "@/components/todo-list/todo-list-container";

export default async function Home() {
  const session = await auth(); // Server-seitiges Abrufen der Session

  return (
    <div className="p-6">
      <AddTodoForm session={session} />
      <h1 className="text-xl font-bold mb-6 p-4">Meine To-Dos</h1>
      <div className="mt-8">
        <TodoListContainer />
      </div>
    </div>
  );
}
// bei api calls tags benutzen, zb "array" in "todo"
// dort wo ich die todos anzeige, die gleichen tags mitgeben

// revalidateTags benutzen von next.js zum neu fetchen
