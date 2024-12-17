"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import EditTodoForm from "@/components/forms/edit-todo-form";
import { useState } from "react";
import { useTodos } from "@/components/todos/TodoContext";
import { useEffect } from "react";
import { Todo, TodoListProps } from "@/types/todo";

// Listet alle Todos auf und öffnet das Formular zum bearbeiten und löschen
// Die Todos werden aus dem TodoContext geholt (todos im useTodos) und in den state gesetzt
export default function TodoList({ session }: Omit<TodoListProps, "todos">) {
  // Zeigt die Todos an mittels useTodos vom TodoContext
  const { todos, refreshTodos } = useTodos();
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // der useEffect-hook wird verwendet

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  /* Beim Clicken auf ein Todo, wird es als selectedTodo gesetzt und das Dialog wird geöffnet,
  der das EditTodoForm lädt */
  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowTodoDialog(true);
  };

  // Jede Todo wird in eine Card gepackt und in der Liste angezeigt
  return (
    <>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTodoClick(todo)}
          >
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{todo.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showTodoDialog} onOpenChange={setShowTodoDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Todo editing</DialogTitle>
            <DialogDescription>Edit your todo</DialogDescription>
          </DialogHeader>
          {selectedTodo && (
            <EditTodoForm
              todo={selectedTodo}
              session={session}
              onClose={() => {
                // schliesst das Dialog
                setShowTodoDialog(false);
                setSelectedTodo(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
