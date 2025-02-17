// Diese Datei verwaltet den globalen Zustand der Todos
// Fetcht die crud funktionen aus der api und stellt sie hier bereit

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

import { Todo } from "@/types/todo";
import { isPast, isToday, isTomorrow, startOfDay } from "date-fns";

// das ist die kontext typ definition
type TodoResponse = { success: boolean; message: string };

type TodoContextType = {
  todos: Todo[]; // Liste aller Todos
  sharedTodos: Todo[]; // Liste aller geteilter Todos
  setSharedTodos: (todos: Todo[]) => void; // Funktion zum Setzen aller geteilter Todos
  setTodos: (todos: Todo[]) => void; // Funktion zum setzen aller todos
  addTodo: (todo: Todo) => void; // funktion zum hinzufügen eines todos
  updateTodo: (todo: Todo) => void; // Funktion zum Aktualisieren eines Todos
  deleteTodo: (id: string) => Promise<TodoResponse>; // Funktion zum Löschen eines Todos
  refreshTodos: () => Promise<void>; // Funktion zum Neuladen aller Todos
  searchQuery: string; // Suchbegriff
  setSearchQuery: (query: string) => void; // Setter für Suchbegriffe
  filteredTodos: Todo[]; // Gefilterte Todo-Liste
  activeTag: string | null; // Aktiver Tag
  setActiveTag: (tag: string | null) => void; // Setter für den aktiven Tag
  clearFilters: () => void; // Funktion zum Zurücksetzen der Filter
};

// Erstellen des Kontexts
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider-Komponente
export function TodoProvider({ children }: { children: ReactNode }) {
  // State für die Todo-Liste
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sharedTodos, setSharedTodos] = useState<Todo[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTodos = useMemo(() => {
    const uniqueTodoIds = new Set();
    const uniqueFilteredTodos: Todo[] = [];

    // Kombiniere und filtere Todos
    const allTodos = [...todos, ...sharedTodos];

    for (const todo of allTodos) {
      if (!uniqueTodoIds.has(todo.id)) {
        uniqueTodoIds.add(todo.id);

        // Prüfe Filter
        let shouldInclude = true;

        // Tag Filter
        if (
          activeTag &&
          (!todo.tags || !todo.tags.some((tag) => tag.text === activeTag))
        ) {
          shouldInclude = false;
        }

        // Suchwort Filter
        if (shouldInclude && searchQuery) {
          const query = searchQuery.toLowerCase();
          shouldInclude =
            todo.title.toLowerCase().includes(query) ||
            todo.description?.toLowerCase().includes(query) ||
            (todo.tags?.some((tag) => tag.text.toLowerCase().includes(query)) ??
              false);
        }

        if (shouldInclude) {
          uniqueFilteredTodos.push(todo);
        }
      }
    }

    return uniqueFilteredTodos;
  }, [todos, sharedTodos, searchQuery, activeTag]);

  const checkDueStatus = useCallback((todo: Todo): Todo => {
    if (!todo.due_date) return todo;

    // Parse das Datum
    const [day, month, year] = todo.due_date.split(".");
    const dueDate = startOfDay(
      new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    );

    // Überprüfe den Status
    const isOverdue = isPast(dueDate) && !isToday(dueDate); // Datum ist in der Vergangenheit und nicht heute
    const isDueSoon = isToday(dueDate) || isTomorrow(dueDate); // Datum ist heute oder morgen

    return {
      ...todo,
      is_due_soon: isDueSoon && !isOverdue, // Nur "due soon" wenn nicht überfällig
      is_overdue: isOverdue,
    };
  }, []);

  // Funktion zum zurücksetzen der Filter
  const clearFilters = useCallback(() => {
    setActiveTag(null);
    setSearchQuery("");
  }, []);

  // ladet die todos neu nach dem bearbeiten oder hinzufügen
  const refreshTodos = useCallback(async () => {
    try {
      const response = await fetch("/api/todos", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.todos)) {
        // Prüfe due Status für alle Todos
        const todosWithDueStatus = data.todos.map((todo: Todo) =>
          checkDueStatus(todo)
        );
        const sharedTodosWithDueStatus = data.shared_todos.map((todo: Todo) =>
          checkDueStatus(todo)
        );
        setTodos(todosWithDueStatus);
        setSharedTodos(sharedTodosWithDueStatus);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Todos:", error);
    }
  }, [checkDueStatus]);

  // Todo Liste erweitern
  const addTodo = useCallback(
    (newTodo: Todo) => {
      const todoWithDueStatus = checkDueStatus(newTodo);
      setTodos((prevTodos) => [...prevTodos, todoWithDueStatus]);
    },
    [checkDueStatus]
  );

  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      const todoWithDueStatus = checkDueStatus(updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? todoWithDueStatus : todo
        )
      );
    },
    [checkDueStatus]
  );

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
      return {
        success: response.ok,
        message: data.message,
      };
    } catch (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        message: "Ein Fehler ist aufgetreten",
      };
    }
  }, []);

  // Bereitstellung des Kontexts
  return (
    <TodoContext.Provider
      value={{
        todos: filteredTodos, // gefilterte todos werden angezeigt
        setTodos,
        sharedTodos,
        setSharedTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        refreshTodos,
        searchQuery,
        setSearchQuery,
        filteredTodos,
        activeTag,
        setActiveTag,
        clearFilters,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

// Hook für einfachen Zugriff auf den Kontext
export function useTodos() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
