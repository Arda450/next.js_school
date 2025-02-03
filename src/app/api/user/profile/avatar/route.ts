import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Change Username route

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { profile_image } = await request.json();
    // Stelle sicher, dass avatar vorhanden ist
    if (!profile_image) {
      return NextResponse.json(
        { error: "Avatar URL is required" },
        { status: 400 }
      );
    }

    console.log("Avatar URL being sent:", profile_image);

    const response = await fetch(`${process.env.BACKEND_URL}/api/user/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json", // hier explizit JSON anfordern
      },
      body: JSON.stringify({ profile_image }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update avatar");
    }

    const data = await response.json();
    if (data.status === "success") {
      return NextResponse.json({
        status: "success",
        user: data.user,
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
