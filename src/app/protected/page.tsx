// Ohne "use client". Dies ist eine Server-Komponente
import AddTodoForm from "@/components/forms/add-todo-form";
import { auth } from "@/auth";
import TodoListContainer from "@/components/todo-list/todo-list-container";

// page.tsx
export default async function Home() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AddTodoForm session={session} />
        </div>
        <div>
          <TodoListContainer />
        </div>
      </div>
    </div>
  );
}
// bei api calls tags benutzen, zb "array" in "todo"
// dort wo ich die todos anzeige, die gleichen tags mitgeben

// revalidateTags benutzen von next.js zum neu fetchen
