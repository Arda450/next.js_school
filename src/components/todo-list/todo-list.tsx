"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import EditTodoForm from "@/components/forms/edit-todo-form";
import { useState } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
}

interface TodoListProps {
  todos: Todo[];
  session: any;
}

export default function TodoList({ todos, session }: TodoListProps) {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setOpen(true);
  };

  return (
    <>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTodoClick(todo)}
          >
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{todo.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Todo bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Details Ihres Todos hier.
            </DialogDescription>
          </DialogHeader>
          {selectedTodo && (
            <EditTodoForm
              todo={selectedTodo}
              session={session}
              onClose={() => {
                setOpen(false);
                setSelectedTodo(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
