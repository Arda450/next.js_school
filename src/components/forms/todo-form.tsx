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
import { useCallback, useEffect, useState } from "react"; // Für die zustandsverwaltung
import { useTodos } from "../todos/todo-context";
import { toast } from "sonner";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
import InputWithTags from "../ui/input-with-tags";
import { UserSearch } from "../user/user-search";

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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      due_date: undefined,
      status: "open",
      tags: [],
      shared_with: [],
    },
  });

  // Memoize selectedUsers state updates
  const handleUserSelect = useCallback((username: string) => {
    setSelectedUsers((prev) => {
      const newUsers = prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username];
      return newUsers;
    });
  }, []);

  // Füge einen useEffect hinzu, der auf Änderungen von selectedUsers reagiert
  useEffect(() => {
    form.setValue("shared_with", selectedUsers);
  }, [selectedUsers, form]);

  // Memoize form submission
  const onSubmit = useCallback(
    async (data: TodoFormValues) => {
      setIsSubmitting(true);
      try {
        // Datum formattieren vor dem Senden ins dd-mm-yyyy foramt
        const formattedData = {
          ...data,
          due_date: data.due_date ? format(data.due_date, "dd.MM.yyyy") : null,
        };

        const response = await fetch(`/api/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });

        const responseData = await response.json();

        console.log(responseData);
        if (response.ok) {
          toast.success("To-Do created successfully!", {
            duration: 3000,
          });
          form.reset(); // inputfelder zurücksetzen
          setSelectedUsers([]); // Ausgewählte User zurücksetzen
          await refreshTodos(); // Warte auf das erneute Laden der Todos
          onCancel(); // formular wird erst nach dem neu laden der todos geschlossen
        } else {
          switch (response.status) {
            case 400:
              toast.error(responseData.message || "Ungültige Eingabedaten.");
              break;
            case 422:
              toast.error(responseData.message || "Validierungsfehler.");
              break;
            default:
              toast.error(
                "Serverfehler. Bitte versuchen Sie es später erneut."
              );
          }
        }
      } catch (error) {
        console.error("Fehler beim Erstellen des To-Dos:", error);
        toast.error("Ein unerwarteter Fehler ist aufgetreten.");
      } finally {
        setIsSubmitting(false); // Button wieder aktivieren
      }
    },
    [refreshTodos]
  );

  // Funktion wird im Child definiert mit toggleFormVisibility als onCancel
  const handleCancel = () => {
    form.reset(); // inputfelder zurücksetzen
    setSelectedUsers([]); // ausgewählte user zurücksetzen
    onCancel(); // formular schliessen
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-4xl mx-auto p-1"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter title"
                  {...field}
                  className="rounded-lg"
                />
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
              <FormLabel className="text-base font-semibold">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                  className="min-h-[100px] resize-y rounded-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-[300px]">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-semibold">Tags</FormLabel>
                <InputWithTags
                  selectedTags={field.value || []}
                  onTagsChange={field.onChange}
                />
              </FormItem>
            )}
          />

          {/* datefield */}

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Due Date
                </FormLabel>
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
                    <Group className="inline-flex h-10 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 pe-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                      {/* Hier zeigen wir das formatierte Datum an */}
                      <div className="text-sm">
                        {field.value
                          ? format(field.value, "dd.MM.yyyy")
                          : "Choose a date"}
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
        </div>

        <div className="w-full md:w-2/3 mx-auto">
          <FormField
            control={form.control}
            name="shared_with"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Share with Users
                </FormLabel>
                <FormControl>
                  <UserSearch
                    onSelect={handleUserSelect}
                    selectedUsers={selectedUsers}
                    placeholder="Search users to share with..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          {/* Funktion toggleFormVisibility wird hier aufgerufen */}
          <Button
            variant="outline"
            onClick={handleCancel}
            type="button"
            className="min-w-[100px]"
            aria-label="Cancel creating todo"
          >
            Cancel
          </Button>
          {/* submit button */}
          <Button
            type="submit"
            disabled={isSubmitting} // standartmäßig disabled
            className="min-w-[100px]"
            aria-label={isSubmitting ? "Creating todo..." : "Create todo"}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
