import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Führe hier die Logik für das Abrufen von To-Dos durch
  return NextResponse.json({ todos: [] }); // Beispielantwort
}

export async function POST(request: Request) {
  const body = await request.json();
  // Füge hier die Logik zum Erstellen eines neuen To-Dos hinzu
  return NextResponse.json({ message: "To-Do created" });
}

export async function PUT(request: Request) {
  const body = await request.json();
  // Füge hier die Logik zum Aktualisieren eines To-Dos hinzu
  return NextResponse.json({ message: "To-Do updated" });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  // Füge hier die Logik zum Löschen eines To-Dos hinzu
  return NextResponse.json({ message: "To-Do deleted" });
}

// in der homepage sollte die todo erstellbar sein
// muss noch ergänzt werden

// hier werden nur die todo read und create funcs sein
// muss noch gemacht werden
