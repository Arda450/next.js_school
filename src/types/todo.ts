export type TodoStatus = "open" | "doing" | "completed";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: TodoStatus; // status ist nicht mehr optional und hat spezifische Werte
}

export interface TodoListProps {
  todos: Todo[];
  session: any;
}
