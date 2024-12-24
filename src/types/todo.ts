export type TodoStatus = "open" | "doing" | "completed";

// Neue Tag Interface
export interface Tag {
  id: string;
  text: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  status: TodoStatus; // status ist nicht mehr optional und hat spezifische Werte
  tags?: Tag[];
  shared_with?: string;
}

export interface TodoListProps {
  todos: Todo[];
  session: any;
}
