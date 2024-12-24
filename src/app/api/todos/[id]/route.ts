import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos/${params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      }
    );

    // Wenn die Löschung erfolgreich war (204 oder 200)
    if (response.status === 204 || response.ok) {
      return NextResponse.json({
        status: "success",
        message: "Todo erfolgreich gelöscht",
      });
    }

    // Fehlerfall
    const data = await response.json();
    return NextResponse.json(
      { status: "error", message: data.message || "Fehler beim Löschen" },
      { status: response.status }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
