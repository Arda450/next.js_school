import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // Session prüfen
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json(
        { status: "error", message: "Nicht autorisiert" },
        { status: 401 }
      );
    }

    // Suchbegriff holen
    const searchParams = request.nextUrl.searchParams;
    const term = searchParams.get("term");

    if (!term) {
      return NextResponse.json(
        { status: "error", message: "Suchbegriff erforderlich" },
        { status: 400 }
      );
    }

    // Backend-Anfrage mit korrekten Headers
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/search?term=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fehler bei der Benutzersuche:", error);
    return NextResponse.json(
      { status: "error", message: "Fehler bei der Benutzersuche" },
      { status: 500 }
    );
  }
}
