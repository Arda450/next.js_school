"use client";

import { useEffect, useState } from "react";
// import { Todo } from "../types"; // Typen für Todos (optional, für bessere Typisierung)
// import axios from "axios"; // API-Client

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Abrufen der To-Dos vom Backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todos"); // API-Endpunkt zum Abrufen der Todos
        setTodos(response.data.todos);
      } catch (err) {
        setError("Fehler beim Abrufen der To-Dos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meine To-Dos</h1>
      {todos.length === 0 ? (
        <p>Du hast noch keine To-Dos erstellt.</p>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="bg-white p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold">{todo.title}</h2>
              <p>{todo.description}</p>
              <p>
                <strong>Status:</strong> {todo.status}
              </p>
              <p>
                <strong>Fällig am:</strong> {todo.due_date}
              </p>
              <p>
                <strong>Tags:</strong> {todo.tags.join(", ")}
              </p>
              <p>{todo.shared_status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
