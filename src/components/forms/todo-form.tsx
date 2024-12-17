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
import { useState } from "react"; // Für diee Zustandsverwaltung
import { useTodos } from "../todos/TodoContext";
import { toast } from "sonner";
import { Session } from "next-auth";

type TodoFormValues = z.infer<typeof todoSchema>;

interface TodoFormProps {
  // Funktion toggleFormVisibility wird im onCancel als Prop empfangen
  onCancel: () => void;
  session: Session;
}

// onCancel wird hier als Prop übergeben
export default function TodoForm({ onCancel, session }: TodoFormProps) {
  // Lokaler Zustand für Erfolg- oder Fehlermeldungen

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refreshTodos } = useTodos(); // für das erneute Laden der Todos nach erfolgreicher Erstellung

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Funktion wird im Child definiert mit toggleFormVisibility als onCancel
  const handelCancel = () => {
    form.reset();
    onCancel();
  };

  const onSubmit = async (data: TodoFormValues) => {
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
        toast.success("To-Do erfolgreich erstellt!", {
          duration: 3000,
        });
        form.reset(); // Formular zurücksetzen
        refreshTodos(); // Todos erneut laden
        onCancel();
      } else {
        switch (response.status) {
          case 400:
            toast.error(responseData.message || "Ungültige Eingabedaten.");
            break;
          case 422:
            toast.error(responseData.message || "Validierungsfehler.");
            break;
          default:
            toast.error("Serverfehler. Bitte versuchen Sie es später erneut.");
        }
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des To-Dos:", error);
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
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
        <div className="flex justify-start items-center space-x-2">
          {/* Funktion toggleFormVisibility wird hier aufgerufen */}
          <Button variant="outline" onClick={handelCancel} type="button">
            Cancel
          </Button>
          {/* Absenden-Button */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
