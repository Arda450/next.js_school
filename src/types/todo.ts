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
  status: TodoStatus; // wird anfangs als open gesetzt
  tags?: Tag[];
  shared_with?: string[]; // ein todo kann mit mehreren usern geteilt werden, deshalb ein array
  shared_by?: string; // ein todo wird nur von einem user geteilt, deshalb kein array, sondern ein string
  is_due_soon?: boolean;
  is_overdue?: boolean;
}
// Todo interface wird als props übergeben
export interface TodoListProps {
  todos: Todo[];
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  session: any;
}
