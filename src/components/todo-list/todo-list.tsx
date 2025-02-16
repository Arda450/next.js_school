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
import { useTodos } from "@/components/todos/todo-context";
import { useEffect, useState } from "react";
import { Todo, TodoListProps } from "@/types/todo";
import KebabMenu from "@/components/ui/kebap-menu";
import { cn } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import DeleteButton from "../todos/delete-todo-dialog";

export default function TodoList({ session }: Omit<TodoListProps, "todos">) {
  const { sharedTodos, filteredTodos, searchQuery, refreshTodos, activeTag } =
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

  const handleDelete = (todo: Todo) => {
    setSelectedTodo(todo);
    setDialogType("delete");
  };

  // const displayTodos = searchQuery ? filteredTodos : [...todos, ...sharedTodos];

  return (
    <>
      <div className="grid gap-2 md:gap-4 mx-auto p-1">
        {filteredTodos.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center p-4 text-muted-foreground">
            {searchQuery || activeTag
              ? "Keine Todos gefunden"
              : "Keine Todos vorhanden"}
          </div>
        ) : (
          filteredTodos.map((todo) => {
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
                  "relative flex flex-col h-fit overflow-hidden transition-all hover:shadow-md dark:border-border",
                  {
                    "opacity-50": todo.status === "completed",
                  }
                )}
                aria-label={`Todo: ${todo.title}`}
              >
                {(isSharedWithMe || isSharedByMe) && (
                  // shared todo icon around the user icon
                  <div className="absolute top-2 right-12 flex items-center gap-1">
                    <div
                      className={cn(
                        "rounded-full p-1.5 bg-opacity-90 backdrop-blur-sm",
                        {
                          "bg-blue-100 ": isSharedWithMe,
                          "bg-green-100 ": isSharedByMe,
                        }
                      )}
                    >
                      {/* user icon */}
                      <UsersRound
                        className={cn("w-3.5 h-3.5 transition-colors", {
                          "text-blue-600": isSharedWithMe,
                          "text-green-600": isSharedByMe,
                        })}
                      />
                    </div>
                  </div>
                )}

                <KebabMenu
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                  onEdit={() => handleEdit(todo)}
                  onDelete={() => handleDelete(todo)}
                />
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center my-3 whitespace-pre-wrap">
                    {todo.title}

                    {(todo.is_due_soon || todo.is_overdue) && (
                      <span
                        className={cn(
                          "absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full",
                          {
                            "bg-red-600 text-black font-bold": todo.is_overdue,
                            "bg-red-100 text-red-800":
                              todo.is_due_soon && !todo.is_overdue,
                          }
                        )}
                      >
                        {todo.is_overdue ? "DUE" : "Due soon"}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-base text-muted-foreground  mb-4 whitespace-pre-wrap">
                    {todo.description}
                  </CardDescription>

                  <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-2 md:gap-4">
                    {todo.due_date && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-muted-foreground">
                          Due:
                        </span>
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
                    <div className=" text-sm text-blue-400 mt-4">
                      Todo shared with you by: {todo.shared_by}
                    </div>
                  )}
                  {isSharedByMe && (
                    <div className="text-sm text-green-400 mt-4">
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
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>Edit the details of your todo</DialogDescription>
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

      {/* Delete Dialog */}
      {selectedTodo && (
        <DeleteButton
          todo={selectedTodo}
          open={dialogType === "delete"}
          onOpenChange={(open) => !open && handleDialogClose()}
          onError={handleDialogClose}
          onCancel={handleDialogClose}
        />
      )}
    </>
  );
}
