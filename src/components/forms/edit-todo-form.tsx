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

interface EditTodoFormProps {
  todo: {
    id: number;
    title: string;
    description: string;
    status: string;
  };

  onClose: () => void;
}

export default function EditTodoForm({ todo, onClose }: EditTodoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      status: todo.status || "open",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Sending data:", {
        id: todo.id,
        ...data,
        status: data.status || "open", // Stelle sicher, dass status immer gesendet wird
      }); // Debug-Log

      const response = await fetch(`/api/todos`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          ...data,
          status: data.status || "open",
        }),
      });

      const result = await response.json();
      console.log("Response:", result); // Debug-Log

      if (!response.ok) {
        throw new Error(
          result.message || "Fehler beim Aktualisieren des Todos"
        );
      }

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
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
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Optional: Status-Feld hinzufügen */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="open">Offen</option>
                  <option value="doing">In Bearbeitung</option>
                  <option value="completed">Abgeschlossen</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} type="button">
            Abbrechen
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Speichert..." : "Speichern"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
