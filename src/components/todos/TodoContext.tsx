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

// Definition der Kontext-Struktur
type TodoContextType = {
  todos: Todo[]; // Liste aller Todos
  sharedTodos: Todo[]; // Liste aller geteilter Todos
  setSharedTodos: (todos: Todo[]) => void; // Funktion zum Setzen aller geteilter Todos
  setTodos: (todos: Todo[]) => void; // Funktion zum Setzen aller Todos
  addTodo: (todo: Todo) => void; // Funktion zum Hinzufügen eines Todos
  updateTodo: (todo: Todo) => void; // Funktion zum Aktualisieren eines Todos
  deleteTodo: (id: string) => Promise<boolean>; // Funktion zum Löschen eines Todos
  refreshTodos: () => Promise<void>; // Funktion zum Neuladen aller Todos
  searchQuery: string; // Suchbegriff
  setSearchQuery: (query: string) => void; // Setter für Suchbegriff
  filteredTodos: Todo[]; // Gefilterte Todo-Liste
  activeTag: string | null; // NEU
  setActiveTag: (tag: string | null) => void; // NEU
  clearFilters: () => void;
};

// Erstellen des Kontexts
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider-Komponente
export function TodoProvider({ children }: { children: ReactNode }) {
  // State für die Todo-Liste
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sharedTodos, setSharedTodos] = useState<Todo[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null); // NEU
  const [searchQuery, setSearchQuery] = useState(""); // NEU: State für Suchbegriff

  // Modifizierte filteredTodos-Logik
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
    const today = startOfDay(new Date());

    // Überprüfe den Status
    const isOverdue = isPast(dueDate) && !isToday(dueDate); // Datum ist in der Vergangenheit UND nicht heute
    const isDueSoon = isToday(dueDate) || isTomorrow(dueDate); // Datum ist heute ODER morgen

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

  // Modifiziere refreshTodos
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
        // Prüfe Due-Status für alle Todos
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

  // Funktion zum Aktualisieren eines Todos
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

  const deleteTodo = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204 || response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
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
