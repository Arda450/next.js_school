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

    const { id } = params;
    const response = await fetch(`${process.env.BACKEND_URL}/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // Fehlerfall

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
