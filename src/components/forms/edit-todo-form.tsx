"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema } from "@/lib/zod";
import { z } from "zod";
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
import { toast } from "sonner";
import { Todo } from "@/types/todo";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Button as AriaButton,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover as AriaPopover,
} from "react-aria-components";
import { parseDate } from "@internationalized/date";

type EditTodoFormProps = {
  todo: Todo; // wird vom importierten TodoContext übergeben (todos im useTodos)
  session: any;
  onClose: () => void;
};

// Stellt das Formular zum bearbeiten und löschhen von todos bereit

export default function EditTodoForm({ todo, onClose }: EditTodoFormProps) {
  // Der Initialwert für isSubmitting wird auf false gesetzt
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Zugriff auf die updateTodo-Funktion und das deleteTodo aus dem Kontext
  const { updateTodo } = useTodos();
  // showDeleteDialog startet mit false, das heisst der AlertDialog ist zu Beginn nicht sichtbar
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // console.log("Todo received:", todo); // Debugging
  // console.log("Due date:", todo.due_date); // Debugging
  const parseDateString = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      // Parse das Datum im Format "dd.MM.yyyy"
      return parse(dateStr, "dd.MM.yyyy", new Date());
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  // Die Formularfelder werden mit react-hook-form und Zod-Validierung vorkonfiguriert
  // initialisierung der Form
  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      status: todo.status || "open",
      due_date: todo.due_date ? parseDateString(todo.due_date) : undefined,
      tags: todo.tags || [],
    },
  });

  // Beim Absenden des Formulars wird eine PATCH request an die api gesendet
  const onSubmit = async (data: any) => {
    setIsSubmitting(true); // Der Zustand ändert sich auf true.
    setError(null); // Die Fehlermeldung wird auf null gesetzt.

    try {
      const formattedData = {
        ...data,
        due_date: data.due_date ? format(data.due_date, "dd.MM.yyyy") : null,
      };

      // Anfrage wird an das Next.js Backend gesendet
      const handleUpdate = await fetch(`/api/todos`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          ...formattedData,
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
      toast.success("Todo wurde erfolgreich aktualisiert");
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
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Change Due Date</FormLabel>
                <DatePicker
                  value={
                    field.value
                      ? parseDate(format(field.value, "yyyy-MM-dd"))
                      : undefined
                  }
                  onChange={(date) => {
                    if (date) {
                      const jsDate = new Date(date.toString());
                      field.onChange(jsDate);
                    }
                  }}
                >
                  <div className="flex">
                    <Group className="inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 pe-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                      <div className="text-sm">
                        {field.value
                          ? format(field.value, "dd.MM.yyyy")
                          : "Select date"}
                      </div>
                    </Group>
                    <AriaButton className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70">
                      <CalendarIcon size={16} strokeWidth={2} />
                    </AriaButton>
                  </div>
                  <AriaPopover
                    className="z-[100] rounded-lg border border-border bg-background text-popover-foreground shadow-lg shadow-black/5 outline-none w-auto p-0"
                    offset={4}
                  >
                    <Dialog className="max-h-[inherit] overflow-auto p-2">
                      <div
                        style={{
                          zIndex: 100,
                          pointerEvents: "auto",
                        }}
                      >
                        <Calendar className="w-fit">
                          <header className="flex w-full items-center gap-1 pb-1">
                            <AriaButton
                              slot="previous"
                              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:bg-accent hover:text-foreground data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70"
                            >
                              <ChevronLeft size={16} strokeWidth={2} />
                            </AriaButton>
                            <Heading className="grow text-center text-sm font-medium" />
                            <AriaButton
                              slot="next"
                              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:bg-accent hover:text-foreground data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70"
                            >
                              <ChevronRight size={16} strokeWidth={2} />
                            </AriaButton>
                          </header>
                          <CalendarGrid>
                            <CalendarGridHeader>
                              {(day) => (
                                <CalendarHeaderCell className="size-9 rounded-lg p-0 text-xs font-medium text-muted-foreground/80">
                                  {day}
                                </CalendarHeaderCell>
                              )}
                            </CalendarGridHeader>
                            <CalendarGridBody className="[&_td]:px-0">
                              {(date) => (
                                <CalendarCell
                                  date={date}
                                  className={cn(
                                    "relative flex size-9 items-center justify-center whitespace-nowrap rounded-lg border border-transparent p-0 text-sm font-normal text-foreground outline-offset-2 transition-colors data-[disabled]:pointer-events-none data-[unavailable]:pointer-events-none data-[focus-visible]:z-10 data-[hovered]:bg-accent data-[selected]:bg-primary data-[hovered]:text-foreground data-[selected]:text-primary-foreground data-[unavailable]:line-through data-[disabled]:opacity-30 data-[unavailable]:opacity-30 data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70"
                                  )}
                                />
                              )}
                            </CalendarGridBody>
                          </CalendarGrid>
                        </Calendar>
                      </div>
                    </Dialog>
                  </AriaPopover>
                </DatePicker>
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
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
