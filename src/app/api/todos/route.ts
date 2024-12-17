import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// export default async function handler() {
// Fetch all todos
export async function GET() {
  try {
    // Authentifizierung wird überprüft
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Anfrage wird an das Backend gesendet
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Auf Fehler prüfen
    if (!response.ok) {
      throw new Error("Backend request failed");
    }
    // Daten werden zurückgegeben
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    // Fehlerbehandlung
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create a new todo
// To-Do-Erstellung
export async function POST(request: NextRequest) {
  // Abruf der aktuellen Session
  const session = await auth();

  if (!session || !session.accessToken) {
    // Fehler bei fehlendem Token
    return NextResponse.json(
      { message: "Unauthorized: No token found" },
      { status: 401 }
    );
  }

  // Körper der Anfrage parsen
  const body = await request.json();

  console.log("body: ", body);

  try {
    // Weiterleiten der Anfrage an das Backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Authentifizierungstoken verwenden
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: body.title,
          description: body.description,
        }),
      }
    );

    const data = await response.json();

    console.log("data: ", data);

    if (!response.ok) {
      // Fehlerbehandlung basierend auf Backend-Antwort
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data); // Erfolgreiche Antwort zurückgeben
  } catch (error) {
    console.error("Fehler bei der To-Do-Erstellung:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: No token found" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    console.log("Request body:", body); // Debug-Log

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: body.id,
          title: body.title,
          description: body.description,
          status: body.status || "open",
        }),
      }
    );

    const responseData = await response.json();
    console.log("Backend response:", responseData); // Debug-Log

    if (!response.ok) {
      return NextResponse.json(responseData, { status: response.status });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
