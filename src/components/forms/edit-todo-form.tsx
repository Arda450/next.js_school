"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTodos } from "../todos/TodoContext";
import { Todo } from "@/types/todo";
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

interface EditTodoFormProps {
  todo: Todo; // wird vom importierten TodoContext übergeben (todos im useTodos)
  session: any;

  onClose: () => void;
}

// Stellt das Form. zum bearbeiten und löschhen von todos bereit

export default function EditTodoForm({ todo, onClose }: EditTodoFormProps) {
  // Der Initialwert für isSubmitting wird auf false gesetzt
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zugriff auf die updateTodo-Funktion und das deleteTodo aus dem Kontext
  const { updateTodo, deleteTodo } = useTodos();
  // showDeleteDialog startet mit false, das heisst der AlertDialog ist zu Beginn nicht sichtbar
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Die Formularfelder werden mit react-hook-form und Zod-Validierung vorkonfiguriert
  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      status: todo.status || "open",
    },
  });

  // Beim Absenden des Formulars wird eine PATCH request an die api gesendet
  const onSubmit = async (data: any) => {
    setIsSubmitting(true); // Der Zustand ändert sich auf true.
    setError(null); // Die Fehlermeldung wird auf null gesetzt.

    try {
      // Anfrage wird an das Next.js Backend gesendet
      const handleUpdate = await fetch(`/api/todos`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          ...data,
        }),
      });

      const result = await handleUpdate.json();
      console.log("Response:", result); // Debug-Log

      if (!handleUpdate.ok) {
        throw new Error(
          result.message || "Fehler beim Aktualisieren des Todos"
        );
      }
      // Nach erfolgreichem Update wird das Todo im globalen Zustand akutalisiert.
      updateTodo(result.todo);
      // Der Dialog (EditTodoForm) wird geschlossen
      onClose();
    } catch (error) {
      console.error("Fehler:", error);
      setError(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // handleDelete wird aufgerugen, wenn der Delete Button gedrückt wird (siehe unten im Code)
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen des Todos");
      }

      deleteTodo(todo.id);
      onClose();
    } catch (error) {
      console.error("Fehler:", error);
      setError(
        error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      );
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="open">open</option>
                    <option value="doing">doing</option>
                    <option value="completed">completed</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end items-center space-x-2">
            <Button
              className="w-full"
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
