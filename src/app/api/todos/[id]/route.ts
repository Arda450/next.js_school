import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Delete a todo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: No token found" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todos/${params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete To-Do");
    }
    return NextResponse.json({ message: "To-Do deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete To-Do" },
      { status: 500 }
    );
  }
}
