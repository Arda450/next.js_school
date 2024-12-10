"use client";

import { todoSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { error } from "console";
import { useState } from "react"; // Für Zustandsverwaltung

type TodoFormValues = z.infer<typeof todoSchema>;

export default function TodoForm() {
  // Lokaler Zustand für Erfolg- oder Fehlermeldungen
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: TodoFormValues) => {
    setStatusMessage(null); // Vorherige Nachricht zurücksetzen
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) {
        setStatusMessage("To-Do erfolgreich erstellt!");
        form.reset(); // Formular zurücksetzen
      } else {
        switch (response.status) {
          case 400:
            setStatusMessage(responseData.message || "Ungültige Eingabedaten.");
            break;
          case 422:
            setStatusMessage(responseData.message || "Validierungsfehler.");
            break;
          default:
            setStatusMessage(
              "Serverfehler. Bitte versuchen Sie es später erneut."
            );
        }
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des To-Dos:", error);
      setStatusMessage("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false); // Button wieder aktivieren
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 outline outline-1 outline-solid outline-black"
      >
        {/* Statusnachricht */}
        {statusMessage && (
          <div className="text-center text-red-500">{statusMessage}</div>
        )}

        {/* Titel */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Gib den Titel ein" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Beschreibung */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beschreibung</FormLabel>
              <FormControl>
                <Textarea placeholder="Gib die Beschreibung ein" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Absenden-Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Wird gesendet..." : "To-Do erstellen"}
        </Button>
      </form>
    </Form>
  );
}
