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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditTodoForm from "@/components/forms/edit-todo-form";
import { useTodos } from "@/components/todos/TodoContext";
import { useEffect, useState } from "react";
import { Todo, TodoListProps } from "@/types/todo";
import KebabMenu from "@/components/ui/kebap-menu";
import { toast } from "sonner";
import { isToday, parseISO } from "date-fns";

export default function TodoList({ session }: Omit<TodoListProps, "todos">) {
  const { todos, refreshTodos, deleteTodo } = useTodos();
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    refreshTodos();
  }, [refreshTodos]);

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowTodoDialog(true);
  };

  const handleDelete = async (todo: Todo) => {
    try {
      const res = await deleteTodo(todo.id);

      if (res) {
        toast.success("Todo wurde erfolgreich gelöscht");
        setShowDeleteDialog(false); // Dialog schließen
        setSelectedTodo(null); // Selected Todo zurücksetzen
      } else {
        toast.error("Fehler beim Löschen des Todos");
      }
    } catch (error) {
      console.error("Fehler:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  return (
    <>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {todos.map((todo) => {
          const isDueSoon = todo.due_date && isToday(parseISO(todo.due_date));

          return (
            <Card
              key={todo.id}
              className={`relative p-3 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${
                isDueSoon ? "shadow-red-200 border-red-400" : ""
              }`}
            >
              <KebabMenu
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
                onEdit={() => handleEdit(todo)}
                onDelete={() => {
                  setSelectedTodo(todo);
                  setShowDeleteDialog(true);
                }}
              />
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  {todo.title}
                  {isDueSoon && (
                    <span className="inline-block px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                      Due Soon
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-700">
                  {todo.description}
                </CardDescription>
                {todo.shared_with && (
                  <div className="my-6">
                    Todo shared with: {todo.shared_with}
                  </div>
                )}
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
              </CardContent>
            </Card>
          );
        })}
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
                setShowTodoDialog(false);
                setSelectedTodo(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) {
            setSelectedTodo(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you really want to delete this todo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedTodo && handleDelete(selectedTodo)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
