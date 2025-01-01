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
import { useTodos } from "@/components/todos/TodoContext";
import { useEffect, useState } from "react";
import { Todo, TodoListProps } from "@/types/todo";
import KebabMenu from "@/components/ui/kebap-menu";
import { isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function TodoList({ session }: Omit<TodoListProps, "todos">) {
  const { todos, sharedTodos, filteredTodos, searchQuery, refreshTodos } =
    useTodos();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [dialogType, setDialogType] = useState<"edit" | "delete" | null>(null);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  const handleDialogClose = () => {
    setDialogType(null);
    setSelectedTodo(null);
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setDialogType("edit");
  };

  const displayTodos = searchQuery ? filteredTodos : [...todos, ...sharedTodos];

  return (
    <>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {displayTodos.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            {searchQuery ? "Keine Todos gefunden" : "Keine Todos vorhanden"}
          </div>
        ) : (
          displayTodos.map((todo) => {
            // Prüfe, ob das Todo in sharedTodos ist
            const isSharedWithMe = sharedTodos.some(
              (sharedTodo) => sharedTodo.id === todo.id
            );
            // Prüfe, ob das Todo von mir geteilt wurde (nur für meine eigenen Todos)
            const isSharedByMe =
              !isSharedWithMe &&
              todo.shared_with &&
              todo.shared_with.length > 0;

            return (
              <Card
                key={todo.id}
                className={cn(
                  "relative p-2 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                )}
              >
                {(isSharedWithMe || isSharedByMe) && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-3 h-full rounded-l-lg
                ${
                  isSharedWithMe
                    ? "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300"
                    : "bg-gradient-to-r from-green-100 via-green-200 to-green-300 border-dashed"
                }`}
                  ></div>
                )}

                <KebabMenu
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                  onEdit={() => handleEdit(todo)}
                  todo={todo}
                />
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {todo.title}
                    {todo.is_due_soon && (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                        Due soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-base text-gray-700 mb-4">
                    {todo.description}
                  </CardDescription>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    {todo.due_date && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-600">Due:</span>
                        {todo.due_date}
                      </div>
                    )}
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {todo.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            {tag.text}
                          </span>
                        ))}
                      </div>
                    )}
                    {todo.status && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                          todo.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : todo.status === "doing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span className="font-semibold">{todo.status}</span>
                      </div>
                    )}
                  </div>
                  {isSharedWithMe && (
                    <div className=" text-sm text-blue-800 mt-4">
                      Todo shared with you by: {todo.shared_by}
                    </div>
                  )}
                  {isSharedByMe && (
                    <div className="text-sm text-green-800 mt-4">
                      Todo shared with: {todo.shared_with?.join(", ")}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog
        open={dialogType === "edit"}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todo bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeite die Details deines Todos
            </DialogDescription>
          </DialogHeader>
          {selectedTodo && (
            <EditTodoForm
              todo={selectedTodo}
              session={session}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
