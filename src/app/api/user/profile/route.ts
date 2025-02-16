import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/user/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    return NextResponse.json({
      status: "success",
      user: data.user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/user/profile`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    // Session im Backend löschen
    await fetch(`${process.env.BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 500 }
    );
  }
}
