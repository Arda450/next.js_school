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
import { isToday, isTomorrow } from "date-fns";

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
  searchQuery: string; // NEU: Suchbegriff
  setSearchQuery: (query: string) => void; // NEU: Setter für Suchbegriff
  filteredTodos: Todo[]; // NEU: Gefilterte Todo-Liste
};

// Erstellen des Kontexts
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider-Komponente
export function TodoProvider({ children }: { children: ReactNode }) {
  // State für die Todo-Liste
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sharedTodos, setSharedTodos] = useState<Todo[]>([]);

  const [searchQuery, setSearchQuery] = useState(""); // NEU: State für Suchbegriff

  // filterte die Todos basierend auf searchquery
  const filteredTodos = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return todos.filter((todo) => {
      return (
        // Suche in Titel
        todo.title.toLowerCase().includes(query) ||
        // Suche in Beschreibung (falls vorhanden)
        todo.description?.toLowerCase().includes(query) ||
        false ||
        // Suche in Tags (falls vorhanden)
        todo.tags?.some((tag) => tag.text.toLowerCase().includes(query)) ||
        false
      );
    });
  }, [todos, searchQuery]);

  const checkDueStatus = useCallback((todo: Todo): Todo => {
    if (!todo.due_date) return todo;

    const [day, month, year] = todo.due_date.split(".");
    const dueDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const isdueSoon = isToday(dueDate) || isTomorrow(dueDate);

    return {
      ...todo,
      is_due_soon: isdueSoon,
    };
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
        const todosWithDueStatus = data.todos.map(checkDueStatus);
        const sharedTodosWithDueStatus = data.shared_todos.map(checkDueStatus);

        setTodos(todosWithDueStatus);
        setSharedTodos(sharedTodosWithDueStatus);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Todos:", error);
    }
  }, [checkDueStatus]);

  // Todo Liste erweitern
  const addTodo = useCallback((newTodo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]); // Altes Array (prevTodos) wird um (ein) neues Todo erweitert (newTodo)
  }, []);

  // Funktion zum Aktualisieren eines Todos oder holen eines todos vom server
  const updateTodo = useCallback((updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  }, []);

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
