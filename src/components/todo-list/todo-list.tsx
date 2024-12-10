// // hier werden die todos gefetcht und dann weiter in die protected/ page.tsx weitergegeben

// async function getTodos() {
//   const response = await fetch(`${process.env.BACKEND_URL}/api/todos`, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     return {
//       status: "error",
//       todos: [],
//       errors: "Fehler beim Abrufen der Todos",
//     };
//   }

//   export default async function TodoList() {
//     const todos = await getTodos();

//     return (
//       <div className="space-y-4">
//         {todos.map(
//           (todo: { id: number; title: string; description: string }) => (
//             <div key={todo.id} className="border p-4 rounded shadow">
//               <h2 className="text-lg font-semibold">{todo.title}</h2>
//               <p>{todo.description}</p>
//             </div>
//           )
//         )}
//       </div>
//     );
//   }
// }

async function getTodos(session: any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`, // Token von der Session verwenden
        },
      }
    );

    // console.log(Error);

    if (!response.ok) {
      console.log(response.status);
      // Fehlerhafte Antwort: Gib eine leere Todo-Liste und eine Standardmeldung zurück
      return {
        status: "error",
        todos: [],
        message: "Fehler beim Abrufen der Todos oder keine Todos",
      };
    }

    const data = await response.json();
    return {
      status: "success",
      todos: data.todos || [],
      message: "",
    };
  } catch (error) {
    // Netzwerkfehler oder andere Fehler abfangen
    return {
      status: "error",
      todos: [],
      message: "Ein unerwarteter Fehler ist aufgetreten",
    };
  }
}

interface TodoListProps {
  session: any; // Typen anpassen
}

export default async function TodoList({ session }: TodoListProps) {
  const { status, todos, message } = await getTodos(session);

  return (
    <div className="space-y-4">
      {status === "error" && (
        <div className="text-red-500 font-semibold">{message}</div>
      )}

      {todos.length > 0
        ? todos.map(
            (todo: { id: number; title: string; description: string }) => (
              <div key={todo.id} className="border p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{todo.title}</h2>
                <p>{todo.description}</p>
              </div>
            )
          )
        : status !== "error" && (
            <div className="text-gray-500">Keine Todos vorhanden.</div>
          )}
    </div>
  );
}
