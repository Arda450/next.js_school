import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Warte auf die params
    // mit await bekomme ich den fehler im terminal nicht angezeigt
    const { id } = await context.params;

    const response = await fetch(`${process.env.BACKEND_URL}/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
