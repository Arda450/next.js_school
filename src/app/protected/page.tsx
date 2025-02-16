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
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AddTodoForm />
        </div>
        <div>
          <TodoListContainer />
        </div>
      </div>
    </div>
  );
}
